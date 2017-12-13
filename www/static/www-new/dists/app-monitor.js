webpackJsonp([11],{20:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}Object.defineProperty(exports,"__esModule",{value:!0});var _pageController=__webpack_require__(2),_pageController2=_interopRequireDefault(_pageController),_http=__webpack_require__(6),_http2=_interopRequireDefault(_http),_appApiCenter=__webpack_require__(1),_pageAppApiCenter=__webpack_require__(3),template=__webpack_require__(54),AppMonitor=(0,_pageController2.default)({template:template,property:{tenantName:"",serviceAlias:"",servicecName:"",language:"",code_from:"",serviceId:"",renderData:{pageData:null,appInfo:null,tenantName:"",serviceAlias:""}},method:{getInitData:function(){var _this=this;(0,_appApiCenter.getAppInfo)(this.tenantName,this.serviceAlias).done(function(appInfo){_this.renderData.appInfo=appInfo,(0,_pageAppApiCenter.getPageMonitorAppData)(_this.tenantName,_this.serviceAlias).done(function(pageData){_this.renderData.pageData=pageData,_this.render(),setTimeout(function(){_this.createCharts(),_this.createSocket()})})})},createCharts:function(){var _this2=this;this.getGraphs(),setInterval(function(){_this2.getGraphs()},6e4)},getGraphs:function(){var self=this,start=$("#graph-period").val();"3m-ago"==start?($(".js-time-history").hide(),$(".js-time-now").show(),$(".js-time-now .graph").each(function(){var graph_id=$(this).attr("id"),data={graph_id:graph_id,start:start,last:!0};(0,_http2.default)({showLoading:!1,isTipError:!1,url:"/ajax/"+self.tenantName+"/"+self.serviceAlias+"/graph",type:"POST",data:data}).done(function(res){$("#"+graph_id).find(".val").html(res.value||0)})})):($(".js-time-history").show(),$(".js-time-now").hide(),$(".js-time-history .graph").each(function(){var graph_id=$(this).attr("id"),data={graph_id:graph_id,start:start};(0,_http2.default)({showLoading:!1,isTipError:!1,url:"/ajax/"+self.tenantName+"/"+self.serviceAlias+"/graph",type:"POST",data:data}).done(function(res){if(res.data)for(var i=0;i<res.data.length;i++)delete res.data[i].key;self.makeChart(graph_id,res,start)})}))},makeChart:function(graph_id,event,start){nv.addGraph(function(){var chart=nv.models.stackedAreaChart().x(function(d){return d[0]}).y(function(d){return d[1]}).xScale(d3.time.scale()).color(d3.scale.category10().range()).useInteractiveGuideline(!0).showControls(!1),tickMultiFormat=d3.time.format.multi([["%H:%M",function(d){return d.getMinutes()}],["%H:%M",function(d){return d.getHours()}],["%m/%d",function(d){return d.getDay()&&1!=d.getDate()}],["%m/%d",function(d){return 1!=d.getDate()}],["%Y/%m",function(d){return d.getMonth()}],["%Y",function(){return!0}]]);chart.xAxis.tickFormat(function(d){return tickMultiFormat(new Date(d))}),chart.yAxis.tickFormat(d3.format(event.yAxisFormat)),chart.noData("没有可展示的数据"),chart.showLegend(!1),$("#"+graph_id+" svg").empty(),d3.select("#"+graph_id+" svg").datum(event.data).transition().call(chart);var tsFormat=d3.time.format("%m/%d %H:%M"),contentGenerator=chart.interactiveLayer.tooltip.contentGenerator(),tooltip=chart.interactiveLayer.tooltip;return tooltip.contentGenerator(function(d){return d.value=d.initial,contentGenerator(d)}),tooltip.headerFormatter(function(d){return tsFormat(new Date(d))}),nv.utils.windowResize(chart.update),chart})},createSocket:function(){var self=this;this.webSocket=new WebSocket(this.renderData.pageData.monitor_websocket_uri),this.webSocket.onopen=function(){self.webSocket.send("topic="+self.renderData.pageData.ws_topic)},this.webSocket.onmessage=function(e){e.data&&self.updateTable(e.data)},this.webSocket.onclose=function(){self.createSocket()}},updateTable:function(event){try{event=JSON.parse(event)}catch(e){}var columns=[];$("#rtm-"+event.name+" thead th").each(function(){var name=$(this).attr("name"),align=$(this).attr("class"),item={name:name,align:align};columns.push(item)});var table_body=[];event.data=event.data||[],event.data.reverse();for(var o in event.data){table_body.push('<tr style="word-break: break-all;">');for(var n in columns){var value=event.data[o][columns[n].name];table_body.push('<td class="'+columns[n].align+'">'+value+"</td>")}table_body.push("</tr>")}var tbody=table_body.join("");$("#rtm-"+event.name+" tbody").html(tbody),$("#rtm-"+event.name).closest("section").find("span.rtm-update-time").html("更新时间: "+event.update_time)}},domEvents:{"#graph-period change":function(e){this.getGraphs()}},onReady:function(){this.renderData.tenantName=this.tenantName,this.renderData.serviceAlias=this.serviceAlias,this.getInitData()}});window.AppMonitorController=AppMonitor,exports.default=AppMonitor},54:function(module,exports){module.exports='\n  <ul class="nav nav-pills" role="tablist" id="TabShow" style="position: relative; z-index: 99;">\n        <li style="float:right">\n            <select id="graph-period" class="form-control" style="width:200px">\n              {{if pageData.has_outer_port}}\n              <option value="3m-ago" selected="selected">实时</option>\n              {{/if}}\n              <option value="1h-ago">1小时</option>\n              <option value="8h-ago">8小时</option>\n              <option value="24h-ago">24小时</option>\n              <option value="7d-ago">7天</option>\n          </select>\n        </li>\n    </ul>\n\n    <div class="row js-time-now" style="display: none;padding-left:15px;padding-right:15px;">\n        {{if pageData.has_outer_port}}\n\n              {{if pageData.hasHttpServices}}\n              <div id="status_areas" class="flex-box">\n                  <div class="flex-singe">\n                    <div class="chunkbox">\n                        <p class="hd">平均响应时间</p>\n                        <p id="response-time-stat" class="bd js-realtime-type graph tit-text"><span class="val">0</span><span style="font-size: 12px;color:#ccc"> ms</span></p>\n                    </div>\n                  </div>\n                  <div class="flex-singe">\n                    <div class="chunkbox">\n                      <p class="hd">吞吐率</p>\n                      <p id="throughput-stat" class="bd js-realtime-type graph tit-text"><span class="val">0</span></p>\n                    </div>\n                  </div>\n                  <div class="flex-singe">\n                    <div class="chunkbox">\n                      <p class="hd">在线人数</p>\n                      <p id="online-stat" class="bd js-realtime-type graph tit-text"><span class="val">0</span></p>\n                    </div>\n                  </div>\n              </div>\n\n              <section class="panel panel-default">\n                  <div class="panel-heading">\n                      过去5分钟耗时最多的URl排行<small class="rtm-update-time"></small>\n                  </div>\n                  <div class="panel-body">\n                    <table id="rtm-SumTimeByUrl" class="table">\n                        <thead>\n                          <tr class="active">\n                              <th name="url" style="width: 60%;">Url</th>\n                              <th name="sumtime">累计时间(ms)</th>\n                              <th name="avgtime">平均时间(ms)</th>\n                              <th name="counts" >个数</th>\n                          </tr>\n                        </thead>\n                        <tbody>\n                        </tbody>\n                    </table>\n                  </div>\n              </section>\n              {{/if}}\n\n              {{if appInfo.service.service_type == \'mysql\' }}\n              <div id="status_areas" class="flex-box" style="height:160px">\n                  <div class="flex-singe">\n                    <div class="chunkbox">\n                      <p class="hd">sql平均响应时间</p>\n                      <p id="sqltime-stat" class="bd graph tit-text"><span class="val">0</span><span style="font-size: 12px;color:#ccc"> ms</span></p>\n                    </div>\n                  </div>\n                  <div class="flex-singe">\n                    <div class="chunkbox">\n                      <p class="hd">sql吞吐率</p>\n                      <p id="sql-throughput-stat" class="bd graph tit-text"><span class="val">0</span></p>\n                    </div>\n                  </div>\n              </div>\n              <section class="panel panel-default">\n                      <div class="panel-heading">\n                          过去5分钟耗时最多的SQL排行\n                          <small class=" rtm-update-time"></small>\n                      </div>\n                      <div class="panel-body">\n                        <table id="rtm-SumTimeBySql" class="table">\n                            <thead>\n                                <tr class="active">\n                                    <th name="sql" style="width: 60%;">SQL</th>\n                                    <th name="sumtime" >累计时间(ms)</th>\n                                    <th name="avgtime" >平均时间(ms)</th>\n                                    <th name="counts" >个数</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                            </tbody>\n                        </table>\n                      </div>\n              </section>\n              {{/if}}\n        {{/if}}\n    </div>\n\n    <div class="row js-time-history"  style="position: relative;display: none;">\n        {{if pageData.hasHttpServices}}\n        <div class="col-md-4">\n            <section class="panel panel-default">\n                <div class="panel-heading">\n                响应时间 <i class="tit-tips">(5分钟平均值)</i>\n                </div>\n                <div class="panel-body">\n                    <div id="response-time-stat" class="graph">\n                        <svg></svg>\n                    </div>\n                </div>\n            </section>\n        </div>\n        <div class="col-md-4">\n            <section class="panel panel-default">\n               <div class="panel-heading">\n                 吞吐率  <i class="tit-tips">(1分钟总数)</i>\n               </div>\n               <div class="panel-body">\n                 <div id="throughput-stat" class="graph">\n                   <svg></svg>\n                 </div>\n               </div>\n            </section>\n        </div>\n        <div class="col-md-4">\n           <section class="panel panel-default">\n              <div class="panel-heading">\n               在线人数  <i class="tit-tips">(10分钟)</i>\n             </div>\n             <div class="panel-body">\n               <div id="online-stat"  class="graph">\n                 <svg></svg>\n               </div>\n             </div>\n           </section>\n        </div>\n        \n   {{/if}}\n   {{if appInfo.service.service_type == \'mysql\'}}\n     <div class="col-md-4">\n       <section class="panel panel-default">\n           <div class="panel-heading">\n            sql响应时间  <i class="tit-tips">(5分钟平均值)</i>\n           </div>\n           <div class="panel-body">\n             <div id="sqltime-stat"  class="graph">\n               <svg></svg>\n             </div>\n           </div>\n       </section>\n     </div>\n     <div class="col-md-4">\n       <section class="panel panel-default">\n         <div class="panel-heading"  class="graph">\n           sql执行次数  <i class="tit-tips">(1分钟总数)</i>\n         </div>\n         <div class="panel-body">\n           <div id="sql-throughput-stat" class="graph">\n             <svg></svg>\n           </div>\n         </div>\n       </section>\n     </div>\n   {{/if}}\n    <div class="col-md-4">\n       <section class="panel panel-default">\n         <div class="panel-heading">\n           内存\n         </div>\n         <div class="panel-body">\n           <div id="memory-stat"  class="graph">\n             <svg></svg>\n           </div>\n         </div>\n       </section>\n     </div>\n\n     <div class="col-md-4">\n       <section class="panel panel-default">\n         <div class="panel-heading">\n           磁盘\n         </div>\n         <div class="panel-body">\n           <div id="disk-stat" class="graph">\n             <svg></svg>\n           </div>\n         </div>\n       </section>\n     </div>\n\n     <div class="col-md-4">\n       <section class="panel panel-default">\n         <div class="panel-heading">\n           流量\n         </div>\n         <div class="panel-body">\n           <div id="bandwidth-stat" class="graph"  class="graph">\n             <svg></svg>\n           </div>\n         </div>\n       </section>\n     </div>\n     \n</div>\n'},70:function(module,exports,__webpack_require__){module.exports=__webpack_require__(20)}},[70]);