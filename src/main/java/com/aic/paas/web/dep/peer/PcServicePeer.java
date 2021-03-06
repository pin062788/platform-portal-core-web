package com.aic.paas.web.dep.peer;

import java.util.List;

import com.aic.paas.web.dep.bean.CPcService;
import com.aic.paas.web.dep.bean.PcKvPair;
import com.aic.paas.web.dep.bean.PcService;
import com.aic.paas.web.dep.bean.PcServiceInfo;
import com.aic.paas.web.dep.bean.ServiceType;
import com.binary.jdbc.Page;

public interface PcServicePeer {
	
	
	
	/**
	 * 分页查询
	 * @param pageNum : 指定页码
	 * @param pageSize : 指定页行数
	 * @param svcType
	 * @param cdt : 条件对象
	 * @param orders : 排序字段, 多字段以逗号分隔
	 * @return 
	 */
	public Page<PcService> queryPage(Integer pageNum, Integer pageSize, ServiceType svcType, CPcService cdt, String orders);


	
	
	
	/**
	 * 不分页查询
	 * @param cdt : 条件对象
	 * @param orders : 排序字段, 多字段以逗号分隔
	 * @return 
	 */
	public List<PcService> queryList(ServiceType svcType, CPcService cdt, String orders);

	
	
	
	
	/**
	 * 跟据主键查询
	 * @param id : 主键ID
	 * @return 操作员表[SYS_OP]映射对象
	 */
	public PcService queryById(ServiceType svcType, Long id);
	
	
	
	
	
	/**
	 * 分页查询
	 * @param pageNum : 指定页码
	 * @param pageSize : 指定页行数
	 * @param cdt : 条件对象
	 * @param orders : 排序字段, 多字段以逗号分隔
	 * @return 
	 */
	public Page<PcServiceInfo> queryInfoPage(Integer pageNum, Integer pageSize, ServiceType svcType, CPcService cdt, String orders);


	
	
	
	/**
	 * 不分页查询
	 * @param cdt : 条件对象
	 * @param orders : 排序字段, 多字段以逗号分隔
	 * @return 
	 */
	public List<PcServiceInfo> queryInfoList(ServiceType svcType, CPcService cdt, String orders);

	
	
	
	
	/**
	 * 跟据主键查询
	 * @param id : 主键ID
	 * @return 操作员表[SYS_OP]映射对象
	 */
	public PcServiceInfo queryInfoById(ServiceType svcType, Long id);
	
	
	
	
	
	/**
	 * 保存获更新，判断主键ID[id]是否存在, 存在则更新, 不存在则插入
	 * @param record : PcService数据记录
	 * @return 当前记录主键[id]值
	 */
	public Long saveOrUpdate(ServiceType svcType, PcService record);
	
	
	
	
	
	/**
	 * 跟据分类ID删除
	 * @param id
	 * @return
	 */
	public int removeById(ServiceType svcType, Long id);
	

	/**
	 * 查询服务参数
	 * @param svcId
	 * @param orders
	 * @return
	 */
	public List<PcKvPair> queryParams(Long svcId,String orders);
	
	
	
	/**
	 * 重置服务参数
	 * @param svcId
	 * @param params
	 */
	public void resetParams(ServiceType svcType, Long svcId, List<PcKvPair> params);
	
	
	/**
	 * 分页查询
	 * @param pageNum : 指定页码
	 * @param pageSize : 指定页行数
	 * @param svcType
	 * @param cdt : 条件对象
	 * @param orders : 排序字段, 多字段以逗号分隔
	 * @return 
	 */
	public Page<PcServiceInfo> queryPage4Info(Integer pageNum, Integer pageSize, ServiceType svcType, CPcService cdt, String orders);

}
