export const WIDGET_TYPES = [
  { value:'bar',     label:'Bar chart',   icon:'📈', w:4, h:4 },
  { value:'line',    label:'Line chart',  icon:'📉', w:4, h:4 },
  { value:'pie',     label:'Pie chart',   icon:'🥧', w:4, h:4 },
  { value:'area',    label:'Area chart',  icon:'🏔️', w:4, h:4 },
  { value:'scatter', label:'Scatter plot',icon:'🔵', w:4, h:4 },
  { value:'table',   label:'Table',       icon:'📋', w:4, h:4 },
  { value:'kpi',     label:'KPI Value',   icon:'📊', w:2, h:2 },
]

export const getInitWidgetSettings = (type) => {
  const t = WIDGET_TYPES.find(w => w.value === type) || WIDGET_TYPES.find(w => w.value === 'kpi')
  return {
    widgetType: type, title: 'Untitled', description: '',
    width: t.w, height: t.h,
    // KPI
    metric:'totalAmount', aggregation:'Sum', format:'Number', precision:0,
    // Chart
    xAxis:'product', yAxis:'totalAmount', color:'#FFCC00', showLabels:false,
    // Pie
    dataField:'status', showLegend:true,
    // Table
    columns:['id','customerName','email','product','totalAmount','status'],
    sortBy: 'Ascending',
    pageSize:5, applyFilter: false, filters: [], fontSize:14, headerColor:'#54bd95',
  }
}
