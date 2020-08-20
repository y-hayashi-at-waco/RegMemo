#target indesign
#targetengine RegMemo

    Array.prototype.includes = function(item){
    for(var i = 0; i<this.length; i++) {
        if(this[i] === item) {
            return true;
        }
    }
    return false;
}

//-----------------------------------------------------------------------------------------------

var fileName = $.fileName; //自身のパス
var ParentPth = File(fileName).parent;
var myCSV=ParentPth + "/" + "Reg.txt";
var regexLists=[];
if (File(myCSV).exists) {
    fileObj = new File(myCSV);
    fileObj.open("r");
    txt = fileObj.read();
    regexLists=txt.split("\n");
        if(regexLists[regexLists.length-1]==""){
            regexLists.pop();}
    fileObj.close();
    mainPalette(0);
}else{
    var res=confirm("正規表現パターンの登録記録がありません。\n新規に作成しますか？");
    if(res){
            mainPalette(99999);
    }
}

//-----------------------------------------------------<SUI>-----------------------------------------------------
function mainPalette(num){
var myWidth=264;
var palette1 = new Window("palette"); 
    palette1.text = "RegMemory"; 
    palette1.orientation = "column"; 
    palette1.alignChildren = ["center","top"]; 
    palette1.spacing = 10; 
    palette1.margins = 16; 
    
var dropdown1_array = getList(0); 
var dropdown1 = palette1.add("dropdownlist", undefined, undefined, {name: "dropdown1", items: dropdown1_array}); 
    if(num!=99999){
    dropdown1.selection = num;
    }else{
        dropdown1.selection = 0;
        }
    dropdown1.preferredSize.width = myWidth; 
    dropdown1.onChange=function(){
        var myString=getList(1)[dropdown1.selection.index];　//0はタイトル、1は中身
        edittext1.text =myString;}

var edittext1 = palette1.add('edittext {properties: {name: "edittext1", readonly: true, multiline: true}}'); 
    if(num!=99999){
        edittext1.text =getList(1)[num];　//0はタイトル、1は中身
        }else{
            edittext1.text =""}
    
    edittext1.preferredSize.width = myWidth; 
    edittext1.preferredSize.height = 120; 

var divider1 = palette1.add("panel", undefined, undefined, {name: "divider1"}); 
    divider1.alignment = "fill"; 
    
var group1=palette1.add("group", undefined, undefined, {name: "group1"});
    group1.orientation = "row"; 
    group1.alignChildren = ["left","center"]; 
    group1.spacing = 3; 
    group1.margins = 0; 
    

var button1= group1.add("button", undefined, undefined, {name: "button12"}); 
    button1.text = "編　集"; 
    if(num==99999){
        button1.enabled=false;
        }
    button1.onClick=function(){
        editDialog(dropdown1.selection.index,"edit");
        palette1.close();
        updateP1(dropdown1.selection.index);
        }
    
var button2 = group1.add("button", undefined, undefined, {name: "button11"}); 
    button2.text = "新規登録"; 
    button2.onClick=function(){
        editDialog(dropdown1_array.length+1,"new");
        palette1.close();
        updateP1(dropdown1_array.length); 
        }
    
var divider2 = palette1.add("panel", undefined, undefined, {name: "divider2"}); 
    divider2.alignment = "fill";      
    
var button3 = palette1.add("button", undefined, undefined, {name: "button13"}); 
    button3.text = "正規表現スタイルに追加"; 
    button3.onClick=function(){
        var sel=app.selection[0];
        var myType=['InsertionPoint','Character','Text','Paragraph'];
        if(myType.includes(sel.constructor.name)){
                var myStr=patternEditDialog(edittext1.text);
                if(myStr!=false){
                    var myP= sel.paragraphs
                    for(i=0; i<myP.length; i++){
                    var NGS=myP[i].nestedGrepStyles.add();
                    NGS.grepExpression=myStr
                }
                var myAction = app.menuActions.itemByName("正規表現スタイル...");
                myAction.invoke();
                }            
        }else{
            alert('文字列を選択してください');
            }   
     }    
    
var divider3 = palette1.add("panel", undefined, undefined, {name: "divider3"}); 
    divider2.alignment = "fill";         
    
var statictext1 = palette1.add("statictext", undefined, undefined, {name: "statictext1", multiline: true}); 
      statictext1.text =  "登録した情報をリストから削除したい場合は、\n編集ボタンで情報を呼び出して\nテキストボックスを空欄にしてください";     
      statictext1.preferredSize.width = myWidth
//-----------------------------------------------------</SUI>-----------------------------------------------------

palette1.show();
}

//--------------------------------------------------<function>--------------------------------------------------
//パレット1更新
function updateP1(num){
    //palette1.close();
    mainPalette(num);
    }

//リスト情報取得
function getList(num){
    var  Val=[];
        for(i=0; i<regexLists.length; i++){
                try{
                    x=regexLists[i].split("<<<>>>")
                    Val.push(x[num]);
                }
                catch(err){}
        }
    return Val
}

//編集ダイアログ表示
function editDialog(num,sts) {
  var dialog = new Window("dialog"); 
      dialog.text = "登録情報編集"; 
      dialog.orientation = "column"; 
      dialog.alignChildren = ["left","top"]; 
      dialog.spacing = 10; 
      dialog.margins = 16; 

  var edittextED1 = dialog.add('edittext {properties: {name: "edittextED1"}}'); 
      edittextED1.preferredSize.width = 192; 
      edittextED1.preferredSize.height = 24; 
      edittextED1.alignment = ["left","top"]; 
      if(sts=="edit"){
      edittextED1.text=getList(0)[num];
      } else if(sts=="new"){
          edittextED1.text=""}
 
  var edittextED2 = dialog.add('edittext {properties: {name: "edittextED2", multiline: true}}'); 
      edittextED2.preferredSize.width = 192; 
      edittextED2.preferredSize.height = 48; 
      edittextED2.alignment = ["left","top"]; 
      if(sts=="edit"){
      edittextED2.text=getList(1)[num];
      } else if(sts=="new"){
          edittextED2.text=""}

  var buttonED1 = dialog.add("button", undefined, undefined, {name: "buttonED1"}); 
      buttonED1.text = "登録"; 
      buttonED1.alignment = ["center","top"]; 
      buttonED1.onClick=function(){
          var regValue=edittextED1.text+"<<<>>>"+edittextED2.text;
          if(sts=="edit"){
                registList(num, regValue);
          }else if(sts=="new"){
                addList(regValue);
              }
          dialog.close();
          }

  dialog.show();

  return dialog;

}

function registList(num, regValue){
    //配列　regexLists　を更新
    if(regValue!="<<<>>>"){
    regexLists[num]=regValue;
    }else{
        regexLists.splice(num,1);
        num=0;
        }
    
    var fileName = $.fileName; //自身のパス
    var ParentPth = File(fileName).parent;
    var myCSV=ParentPth + "/" + "Reg.txt";
    if (myCSV) {
      fileObj = new File(myCSV);
      fileObj.open("w");
      for(i=0; i<regexLists.length; i++){
          fileObj.writeln(regexLists[i]);
          }
      fileObj.close()
      return regexLists;
    }
}

function addList(regValue){
    //配列　regexLists　に追加
    if(regValue!="<<<>>>"){
    regexLists.push(regValue);

    
    var fileName = $.fileName; //自身のパス
    var ParentPth = File(fileName).parent;
    var myCSV=ParentPth + "/" + "Reg.txt";
    if (myCSV) {
      fileObj = new File(myCSV);
      fileObj.open("w");
      for(i=0; i<regexLists.length; i++){
          fileObj.writeln(regexLists[i]);
          }
      fileObj.close()
     }
    return regexLists;
    }
}

function patternEditDialog (str) {
      var PEDialog = new Window("dialog"); 
      PEDialog.text = "正規表現パターン編集"; 
      PEDialog.orientation = "column"; 
      PEDialog.alignChildren = ["center","top"]; 
      PEDialog.spacing = 10; 
      PEDialog.margins = 16; 

  var edittextPE = PEDialog .add('edittext {properties: {name: "PEedittext1", multiline: true}}'); 
      edittextPE.preferredSize.width = 177; 
      edittextPE.preferredSize.height = 52; 
      edittextPE.text=str
 
 var groupPE=PEDialog.add("group", undefined, undefined, {name: "group1"});
    groupPE.orientation = "row"; 
    groupPE.alignChildren = ["left","center"]; 
    groupPE.spacing = 3; 
    groupPE.margins = 0; 

  var myOrder=false;
  
  var buttonPE1 = groupPE .add("button", undefined, undefined, {name: "button1"}); 
      buttonPE1.text = "実　行"; 
      buttonPE1.onClick=function(){
          PEDialog.close();
          myOrder=true;
        }
  var buttonPE2 = groupPE .add("button", undefined, undefined, {name: "button1"}); 
      buttonPE2.text = "cancel"; 
      buttonPE2.onClick=function(){
          PEDialog.close();
          myOrder=false;
        }
  PEDialog.show();
  if(myOrder){
    return edittextPE.text;
  }else{
      return false;
      }
}