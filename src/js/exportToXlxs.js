const fs = require('fs');
const betterXlsx = require('better-xlsx');
require('script-loader!file-saver');
require('script-loader!@/js/Blob');
require('script-loader!xlsx-style/dist/xlsx.core.min');// 引入npm的xlsx-style模块导出Excel并修改样式

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export const export_json_to_excel = (SheetNames,Sheets, defaultTitle) => {
    /* original data */
    var wb = new Workbook();
    
    /* add worksheet to workbook */
    wb.SheetNames = SheetNames;
    wb.Sheets = Sheets;
    console.log(wb);
    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    var title = defaultTitle || '列表'
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}

export const data2Workbook = (data,merges,cols,pageSetup) => {
    var ws = {};
    var num = 10000000;
    var range = {s: {c: num, r: num}, e: {c: 0, r: 0}};
    // for(var i=0;i<merges.length;i++){
    //     merges[i].e.c = merges[i].e.c+1;
    // }
    ws['!merges'] = merges;
    // cols.unshift({ wpx: 30 });
    ws['!cols'] = cols;
    if(pageSetup){
        ws['!pageSetup'] = pageSetup;//{scale: '94', orientation: 'landscape'};
    }
    // for(var i=0;i<data.length;i++){
    //     if(data[i].length>1){
    //         if(i==2){
    //             data[i].unshift({ 
    //                 value:"编号",
    //                 type:"title",
    //                 style:{
    //                     font:{
    //                         color:{ rgb: "FF000000"}
    //                     },
    //                     alignment:{
    //                         horizontal:"center",
    //                         vertical:"center"
    //                     },
    //                     border:{
    //                         top:{ style: "thin", color: { rgb: "FF000000"} },
    //                         bottom:{ style: "thin", color: { rgb: "FF000000"} },
    //                         left:{ style: "thin", color: { rgb: "FF000000"} },
    //                         right:{ style: "thin", color: { rgb: "FF000000"} }
    //                     }
    //                 }
    //             });
    //         }else{
    //             data[i].unshift({ 
    //                 value:i-2,
    //                 type:"content",
    //                 style:{
    //                     font:{
    //                         color:{ rgb: "FF000000"}
    //                     },
    //                     alignment:{
    //                         horizontal:"center",
    //                         vertical:"center"
    //                     },
    //                     border:{
    //                         top:{ style: "thin", color: { rgb: "FF000000"} },
    //                         bottom:{ style: "thin", color: { rgb: "FF000000"} },
    //                         left:{ style: "thin", color: { rgb: "FF000000"} },
    //                         right:{ style: "thin", color: { rgb: "FF000000"} }
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // }
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C].value};

            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';
            if(data[R][C].style){
                cell.s = data[R][C].style;
            }
            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < num) ws['!ref'] = XLSX.utils.encode_range(range);
    // ws['!pageSetup'] = {scale: '94', orientation: 'landscape'};//'portrait':纵向，'landscape':横向
    // ws['!printHeader'] = [1,2];
    // ws['!merges'] = [ {s:{c:0, r:0}, e:{c:concat-1, r:0}} ]
    // ws['!cols'] = [{ wpx: 70 },{ wpx: 80 },{ wpx: 90 },{ wpx: 70 },{ wpx: 60 },{ wpx: 90 },{ wpx: 90 }];
    return ws;
}