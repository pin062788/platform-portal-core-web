var CurrDataMap = {};
var CurrSvcId = "";

var ParamPageNum = 1;

var GridAddId = 1;

var TreeData = null;
var SelForCenterType = null;	//1=数据中心    2=资源中心    3=网络区域
var SelForCenterId = null;

var mouseenter = false;

var ParentLeftWidth = 0;
var ParentHeaderHeight = 0;


function init() {
	initData(function() {
		initComponent();
		initListener();
		initFace();
		query();
	});
	
}


function sub(str){
	if(CU.isEmpty(str)){
		return "";
	}
	if(str.length>10){
		return str.substring(0,10);
	}
	return str;
}

function initData(cb) {
	var pb = CC.getParentLayoutBorder();
	ParentLeftWidth = pb.width;
	ParentHeaderHeight = pb.height;
	
	ParamPageNum = PRQ.get("pageNum");
	if(CU.isEmpty(ParamPageNum)) ParamPageNum = 1;
	RS.ajax({url:"/res/res/getResRegionDropListMap",ps:{addEmpty:true, addAttr:true ,opts:"dc|rc"},cb:function(result) {
		DROP["DV_DATA_CENTER_CODE"] = result["dc"];
		DROP["DV_RES_CENTER_CODE"] = result["rc"];
		var dropList = [];
		for(var i=1; i<result["dc"].length; i++) dropList.push(result["dc"][i]);
		for(var i=1; i<result["rc"].length; i++) dropList.push(result["rc"][i]);
		TreeData = toTreeData(dropList);
		if(CU.isFunction(cb)) cb();
	}});
	
}
function initComponent() {
	$("#sel_forcenter").treeview({data:TreeData,color:"#428bca",selectedBackColor:"#f0f8ff",selectedColor:"#428bca",collapseIcon:"fa fa-minus-square-o",expandIcon:"fa fa-plus-square-o",onNodeSelected: function(e, node) {
		if(CU.isEmpty(node.id)) {
			SelForCenterType = null;
			SelForCenterId = null;
			$("#forcenter").val("");
		}else {
			SelForCenterType = node.param1;
			SelForCenterId = node.id;
			$("#forcenter").val(node.text);
		}
		$('#sel_forcenter').hide();
		query(1);
	}});
	$("#sel_forcenter").treeview("collapseAll", {silent:true});
	
}

function initListener() {
	$("#appId").bind("keyup", doCdtTFKeyUp);
	$("#accessCode").bind("keyup", doCdtTFKeyUp);
	
	$("#forcenter").bind("focus",function(){
		var sul = $('#sel_forcenter');
		sul.css("top", $("#forcenter").offset().top-$("#forcenter").height()+ParentHeaderHeight+10);
		sul.css("left", $("#forcenter").offset().left-$("#forcenter").width()-130+ParentLeftWidth+5);
		sul.show(); 
	});
	$("#forcenter").on("blur", function() {
		if(!mouseenter) $("#sel_forcenter").hide();
	});
	
	$("#sel_forcenter").on("mouseenter",function(){mouseenter=true;});
	$("#sel_forcenter").on("mouseleave",function(){mouseenter=false;});
	$("#sel_forcenter").bind("click", function() {
		if(!$("#sel_forcenter").is(":hidden")) $("#forcenter").focus();
	});
	
	$("#btn_query").bind("click",function(){query();});
	$("#grid_pageSize").bind("change",function(){query();});
	$("#btn_add").bind("click",function(){window.location = ContextPath + "/dispatch/mc/1040401?pageNum="+ParamPageNum;});
	$("#a_add_param").bind("click",function(){addParamRow();});
	$("#btn_Ok").bind("click",function(){saveSvcParams();});
	
	RS.setAjaxLodingButton("btn_Ok");
}
function initFace() {
}


/** 执行条件文本框回车查询 **/
function doCdtTFKeyUp(e) {
	if(e.keyCode === 13) query(1);
}

function toTreeData(dropList) {
	var tree = [{}];
	var pnobj = {};
	for(var i=0; i<dropList.length; i++) {
		var item = dropList[i];
		var type = item.param1;
		
		item.id = item.code;
		item.text = item.name;
		
		pnobj[item.code+"_"+type] = item;
		
		if(type == "1") {
			item.icon = "fa fa-database";
			tree.push(item);
		}else {
			item.icon = type=="2" ? "fa fa-sitemap" : "fa fa-flash";
			var pn = pnobj[item.parentCode+"_"+(parseInt(type, 10)-1)];
			if(CU.isEmpty(pn)) continue ;
			if(CU.isEmpty(pn.childNodes)) pn.childNodes = [];
			pn.childNodes.push(item);
		}
	}
	return tree;
}

function query(pageNum){
	if(CU.isEmpty(pageNum)) pageNum = 1;
	$("#appaccessTable").html("");
	$("#ul_pagination").remove();
	$("#pagination_box").html('<ul id="ul_pagination" class="pagination-sm"></ul>');
	var pageSize = $("#grid_pageSize").val();
	var appId = $("#appId").val();
	var accessCode = $("#accessCode").val();
	var orders = "ID";
	
	var ps = {pageNum:pageNum,pageSize:pageSize,appId:appId,accessCode:accessCode,orders:orders};
	
	if(!CU.isEmpty(SelForCenterType) && !CU.isEmpty(SelForCenterId)) {
		switch (SelForCenterType) {		//1=数据中心    2=资源中心 
			case "1": ps.dataCenterId = SelForCenterId; break;
			case "2": ps.resCenterId = SelForCenterId; break;
		}
	}
	
	RS.ajax({url:"/app/access/queryPage",ps:ps,cb:function(r) {
		if(!CU.isEmpty(r)){
			var data = r.data;
			for(var i=0;i<data.length;i++){
				CurrDataMap["key_"+data[i].access.id] = data[i];
			}
			ParamPageNum = r.pageNum;
			$("#ul_pagination").twbsPagination({
		        totalPages: r.totalPages?r.totalPages:1,
		        		totalPages: r.totalPages?r.totalPages:1,
		        visiblePages: 7,
		        startPage: r.pageNum,
		        first:"首页",
		        prev:"上一页",
		        next:"下一页",
		        last:"尾页",
		        onPageClick: function (event, page) {
		        	query(page);
		        }
		    	
		    });
			$('#appaccessTable-tmpl').tmpl(r).appendTo("#appaccessTable");
			for(var i=0;i<data.length;i++){
				$("#btn_del_"+data[i].access.id).bind("click", function() {
					var obj = CurrDataMap["key_"+this.id.substring(this.id.lastIndexOf("_")+1)];
					delSrv(obj);
				});
			}
		}
	}});
}

function delSrv(obj) {
	CC.showMsg({msg:"您确定要删除[<font color='blue'>"+obj.access.accessCode+"</font>]吗?",option:2,callback:function(r) {
		if(r != "ok") return ;
		RS.ajax({url:"/app/access/removeById",ps:{id:obj.access.id},cb:function() {
			query(ParamPageNum);
		}});
	}});
}


function removeTag(elId){
	$("#"+elId).remove();
}

