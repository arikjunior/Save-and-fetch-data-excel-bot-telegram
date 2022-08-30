var token = "5679641260:AAHg3dS5HecArfNELFuP6yCVJE0xjfIkU-I"; // ambil token dari botFather telegram
var ssId = "1O3pY8T9lXnUR3-5kDEBElcGxgHOm55seeyWQN_E_tqM"; // ambil ID pada URL database spreadsheets
var UrlPublish = "https://script.google.com/macros/s/AKfycbz6H2Sy2o4SdAaUbrwKDZOdASgWHmWV5Vw_uV_lg6PaKtg1hag/exec"; // ambil url hasil publish

var telegramUrl = "https://api.telegram.org/bot" + token;

//persiapan pengiriman data
function sendText(id,text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text);
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

//melakukan proses simpan dan ambil data
function doPost(e) {
    var data = JSON.parse(e.postData.contents);
    var text = data.message.text;
    
  if(/#/.test(text)) {
    var sheetName = text.slice(1).split(" ")[0];
    var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName) ? SpreadsheetApp.openById(ssId).getSheetByName(sheetName) : SpreadsheetApp.openById(ssId).insertSheet(sheetName);
    var newText = text.split(" ").slice(1).join(" ");
    var id = data.message.chat.id;
    var name = data.message.chat.first_name + " ";
    // simpan ke google sheet
    sheet.appendRow([newText,id,name,new Date()]);
    // tampilkan ke telegram bot
    sendText(id,"Data :"+"\n"+"'"+ newText + "'"+"\n"+"\n"+"Berhasil tersimpan...!");
 }else{
//--------------------------------------------------------------------------------------------------------------
//kirim data ke telegram bot
  var stringJson = e.postData.getDataAsString();
  var updates = JSON.parse(stringJson);
    if(updates.message.text){
      sendText(updates.message.chat.id,CariDataDariIDSheet(updates.message.text)); 
    }
  }
}  
//--------------------------------------------------------------------------------------------------------------
//ambil data dari google spreadsheets
//menentukan sheets mana yang akan diambil
function AmbilSheet1(){
  var rangeName = 'Sheet1!A2:E';
  var rows = Sheets.Spreadsheets.Values.get(ssId, rangeName).values;
  return rows;
}
//menentukan kolom mana yang akan diambil
function CariDataDariIDSheet(IDdata){
  var dataSheet = AmbilSheet1(); 
  for (var row = 0; row < dataSheet.length; row++) {
    if(dataSheet[row][0]==IDdata){ 
      return "Data Ditemukan : "+"\n"+"'"+ dataSheet[row][0] +"'"+"\n" +"\n" +
             "ID User : " + dataSheet[row][1] + "\n" + 
             "Nama User : " + dataSheet[row][2] + "\n" +
             "Waktu Simpan : " + dataSheet[row][3];
    }
  }
  return "Data tidak ditemukan." +"\n"+ "Pastikan format penulisan sudah benar.";
}

//Jangan lupa aktifkan setwebhook
//https://api.telegram.org/bot5679641260:AAHg3dS5HecArfNELFuP6yCVJE0xjfIkU-I/setwebhook?url=https://script.google.com/macros/s/AKfycbz6H2Sy2o4SdAaUbrwKDZOdASgWHmWV5Vw_uV_lg6PaKtg1hag/exec

//link Spreadsheet
//https://docs.google.com/spreadsheets/d/1O3pY8T9lXnUR3-5kDEBElcGxgHOm55seeyWQN_E_tqM/edit#gid=0