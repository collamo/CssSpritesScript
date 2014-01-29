/*--------------------------------------------------------------------------

Copyright (c) 2009 Koji Miyauchi -http://collamo.jp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

--------------------------------------------------------------------------- */

/* ---------------------------------------- 
 - var
---------------------------------------- */

var _layers = app.activeDocument.layers;
var _llen = _layers.length;
var cssText1 = "";
var cssText2 = "";
var htmlText = "";
var _mw = app.activeDocument.width;
var _mh = app.activeDocument.height;


/* ---------------------------------------- 
 - function
---------------------------------------- */
//main
function main(){
	getLayersInfo();
	outputFile();
}

//Output "filename".html
function outputFile(){
	var mySavefile = File.saveDialog("Filename...","*.html");
	if(! mySavefile){return};
	if(mySavefile.exists){
		if(! confirm("同名のファイルがすでにあります.\n上書きしてよろしいですか?")){return false;};
	}
	var fileRef = new File(mySavefile+".html");
	flag = fileRef.open ("w","","");
	if (flag)
	{
	fileRef.writeln('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
	fileRef.writeln('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">');
	fileRef.writeln('<head>');
	fileRef.writeln('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
	fileRef.writeln('<meta http-equiv="Content-Script-Type" content="text/javascript" />');
	fileRef.writeln('<title>テンプレート</title>');
	fileRef.writeln('</head>');
	fileRef.writeln('<style><!--');
	fileRef.writeln(cssText1);
	fileRef.writeln(cssText2);
	fileRef.writeln('--></style>');
	fileRef.writeln('<body>');
	fileRef.writeln(htmlText);
	fileRef.writeln('</body>');
	fileRef.writeln('</html>');
	}
	fileRef.close();
}

//get layers information
function getLayersInfo(){
	var l;
	var t;
	var w;
	var h;
	var ab0;
	var ab1;
	var ab2;
	var ab3;
	
	//scan layers
	for(var i=0;i<_llen;i++){
		var al = _layers[i];
		var exeflag = true;
		
		//ignore backgroundLayer
		if(al.isBackgroundLayer){exeflag = false;}
		//ignore unvisible layer
		if(!al.visible){exeflag = false;}
		
		if(exeflag){
			
			//get information single layer
			if(al.typename=="ArtLayer"){		
				ab0 = al.bounds[0];
				ab1 = al.bounds[1];
				ab2 = al.bounds[2];
				ab3 = al.bounds[3];
				
				//ignore space out of the stage
				ab0 < 0 ? ab0 = 0 : 0;
				ab1 < 0 ? ab1 = 0 : 0;
				ab2 > _mw ? ab2 = _mw : 0;
				ab3 > _mh ? ab3 = _mh : 0;								
				
				//output css&html text
				l = ("" + ab0*-1);
				t = ("" + ab1*-1);
				w = ("" + (ab2-ab0));
				h = ("" + (ab3-ab1));
				describeText(al.name,l,t,w,h);
				describeText2(al.name,true);
				
			//scan grouplayers
			}else if(al.typename="LayerSet"){
				
				var llen = al.layers.length;
				var maxTL = new Point(9999,9999);
				var maxBR = new Point(0,0);
				
				//グループレイヤー内単一レイヤー情報取得
				for(var j=0;j<llen;j++){
					var al2 = al.layers[j];
					ab0 = al2.bounds[0];
					ab1 = al2.bounds[1];
					ab2 = al2.bounds[2];
					ab3 = al2.bounds[3];
					
					//ignore unvisible layer
					if(al2.visible){
						//get synthesized image size
						ab0 < maxTL.x ? maxTL.x = ab0 : 0;
						ab1 < maxTL.y ? maxTL.y = ab1 : 0;
						ab2 > maxBR.x ? maxBR.x = ab2 : 0;
						ab3 > maxBR.y ? maxBR.y = ab3 : 0;
					}
				}
				
				//ignore space out of the stage
				maxTL.x < 0 ? maxTL.x = 0 : 0;
				maxTL.y < 0 ? maxTL.y = 0 : 0;
				maxBR.x > _mw ? maxBR.x = _mw : 0;
				maxBR.y > _mh ? maxBR.y = _mh : 0;	
				
				//describe css&html text
				l = ("" + maxTL.x*-1);
				t = ("" + maxTL.y*-1);
				w = ("" + (maxBR.x - maxTL.x));
				h = ("" + (maxBR.y - maxTL.y));
				describeText(al.name,l,t,w,h);
				describeText2(al.name,true);
			}
		}
		if(i==(_llen-1)){
			describeText2("",false);
		}
	}
	return htmlText;
}

//describe text
function describeText(name,l,t,w,h){
	l=l-0;
	t=t-0;
	w=w-0;
	h=h-0;
	
	cssText2 += '#'+name+"{\n";
	cssText2 += 'width:' + w + "px;\n";
	cssText2 += 'height:' + h + "px;\n";
	cssText2 += 'background-position:' + l + 'px ' + t + 'px;\n';
	cssText2 += 'text-indent:-9999px;\n';
	cssText2 += '}\n\n';
	
	htmlText += '<div id=\"' + name + '\">'+ name +'</div>\n'
}

//describe text
function describeText2(name,cflag){
	if(cflag){
		cssText1 += '#'+name;
		cssText1 += ',\n';
	}else{
		cssText1 = cssText1.substring(0,cssText1.length-2);
		var filename = app.activeDocument.name;
		filename = filename.replace(/.psd/, '');
		cssText1 += "{\n";
		cssText1 += "background:url(" + filename + ".gif)\n";
		cssText1 += "}\n";
	}
}

//create point class
function Point(x,y) {
	this.x = x;
	this.y = y;
}

/* ---------------------------------------- 
 - run
---------------------------------------- */

main();