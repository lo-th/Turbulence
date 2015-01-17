var LTH = {};

var esprima = esprima || {};
var CodeMirror = CodeMirror || {};
var GRAD = GRAD || {};

var main;
window.onload = init;
function init(){ main = new LTH.Main(); }

//----------------------------------------
//    MAIN
//----------------------------------------

LTH.Main = function(){
	this.doc = document;
	this.styleType = 'night';
	this.autoTime();

	this.startDemo = 0;
	this.numLesson = 4;

	this.items = [];

	this.showCode = false;
	this.viewType = 'vertical';

	this.scriptText = 14;
	
	this.C1 = null;
	this.C2 = null;
	this.currentLesson = -1;
	this.codeLoaded = false;
	this.isFirst = false;

	this.menu = null;
	this.editor = null;
	this.editorDiv = null;
	this.preview = null;
	this.previewDoc = null;
	this.previewMain = null;
	this.init();
}

LTH.Main.prototype = {
	constructor: LTH.Main,
	init:function (){
		this.C1 = document.createElement( 'canvas' );
		this.C1.width = this.C1.height = 512;
		this.C2 = document.createElement( 'canvas' );
		this.C2.width = this.C2.height = 512;
		var grad1 = new GRAD.Create(this.C1, 'linear', {x0:0,y0:0,x1:0,y1:512}, [[1,150,150,150, 255],[0.5,214,214,214,255],[0,250,250,250,255]]);
		var grad2 = new GRAD.Create(this.C2, 'linear', {x0:0,y0:0,x1:0,y1:512}, [[1,0,0,0, 255],[0.5,33,35,36,255],[0,60,64,66,255]]);

		this.preview = this.doc.createElement( 'iframe' );
		this.preview.style.cssText = 'position:absolute; display:block; border:none; pointer-events:auto;';;
		this.preview.style.background = '#212324';
		this.doc.body.appendChild(this.preview);

		this.editorDiv = this.doc.getElementById( 'editor' );
		this.editor = new LTH.CodeEditor(this);
		this.menu = new LTH.Menu(this);

		if(this.styleType == 'night'){
			this.doc.body.className = 'night';
			this.menu.isNight();
			this.editor.changeTheme(1);
			this.preview.style.background = '#212324';
		}
		this.menu.init(this.startDemo);

		var _this = this;
	    window.onresize = function(e) {_this.resize(e)};
	    this.resize();
	},
	autoTime:function(){
		var h = new Date().getHours();
		if(h>19 || h<6) this.styleType ='night'; else this.styleType ='day';
	},
	resize:function(){
		var w = window.innerWidth;
		var h = window.innerHeight;
		var v0 = 220;
		var topy = 0;
		var v1 = Math.floor((w-v0)*0.5);
		var v2 = Math.floor((h-topy)*0.5);
		if(this.showCode){
			this.editorDiv.style.display = 'block';
			switch(this.viewType){
				case 'vertical':
				    this.setStyle (this.editorDiv, v0, 0, v1, h);
				    this.setStyle (this.preview, v0+v1, 0, v1, h);
				break;
				case 'horizon':
				    this.setStyle (this.editorDiv, v0, 0, w-v0, v2);
				    this.setStyle (this.preview, v0, v2, w-v0, v2);
				break;
			}
			this.editor.refresh();
		} else {
			this.editorDiv.style.display = 'none';
			this.setStyle (this.preview, v0, 0, w-v0, h);
		}
	},
	setTextSize:function(){
		this.editor.changeFontSize(this.scriptText);
	},
	setStyle:function(n, l, t, w, h){
		n.style.left=l+'px';
		n.style.top=t+'px';
		n.style.width=w+'px';
		if(h==0) n.style.height='100%';
		else n.style.height=h+'px';
	},
	switchStyle:function(){
		if(this.styleType == 'day') {
			this.doc.body.className = '';
			this.editor.changeTheme(0);
		}else{
			this.doc.body.className = 'night';
			this.editor.changeTheme(1);
		}
		if(this.codeLoaded) this.previewTheme();
	},
	previewTheme:function(){
		var n = 1;
		var name = '';
		if(this.styleType == 'night'){ n = 0; name = 'night'; }
		var allTags=this.previewDoc.getElementsByTagName('*'), i=0, e;
		while(e=allTags[i++]){ if(e.id) e.className = name; }
		if(this.previewMain.v3d){
			if(n==0){// night
				this.previewMain.v3d.newgradTexture(this.C2, n);
				this.preview.style.background = '#212324';
			} else{
			    this.previewMain.v3d.newgradTexture(this.C1, n);
			    this.preview.style.background = '#D6D6D6';
			}
		}
	},
	previewClearFocus:function(){
		var allTags=this.previewDoc.getElementsByTagName('*'), i=0, e;
		while(e=allTags[i++]){ if(e.id) e.blur(); }
	},
	update:function(value, isPureSrcipt) {
		var _this = this;
		if(isPureSrcipt){
			this.preview.src = './prev.html';
			this.preview.onload = function (e){
				_this.previewMain = _this.preview.contentWindow;
				_this.previewDoc = _this.preview.contentDocument || _this.preview.contentWindow.document;
				var head = _this.previewDoc.getElementsByTagName('head')[0];
				var nscript = _this.previewDoc.createElement("script");
				nscript.type = "text/javascript";
				//nscript.id = "topScript";
				nscript.charset = "utf-8";
				nscript.text = value;
				head.appendChild(nscript);
				_this.codeLoaded=true;
				_this.previewTheme();
				if(_this.isFirst)_this.isFirst=false;
				else _this.showModif();
			}
		}
	},
	checkCurrent:function(){
		for(var i=0; i< this.numLesson; i++){
			if(this.items[i].name==this.currentLesson) this.items[i].style.background = '#881288';
			else this.items[i].style.background = '#121212';
		}
	},
	loadFile:function(name){
		this.isFirst = true;
	    this.editor.loadfile(name);
	},
	openFile:function(o){
	    this.editor.openFile(o);
	},
	createLink:function(blob, name, type){
		this.menu.addIconLink(blob, name, type);
	},
	showModif:function(){
		this.menu.modified();
	},
	callSave:function(){
		this.editor.save();
	}
}

//----------------------------------------
//    MENU
//----------------------------------------

LTH.Menu = function(main){
	this.main = main;
	this.doc = document;
	
	this.icons = [];
	this.files = [];

	this.currentFile = -1;
	this.inModif =  -1;
	this.colorSelect = '#2b2e41';
	this.colorModif = '#FF0073';
	this.colorOver = 'rgba(0,0,0,0.3)';
	this.currentLink = null;

	// button
	this.bn = this.doc.getElementById('bn');
	this.bc = this.doc.getElementById('bc');
	this.b0 = this.doc.getElementById('b0');
	this.b1 = this.doc.getElementById('b1');
	this.b2 = this.doc.getElementById('b2');
	this.bc.style.textDecoration = "none";
	this.b0.style.display = "none";
	this.b1.style.display = "none";
	this.b2.style.display = "none";

	var _this = this;
	this.bc.onclick = function(){_this.showCode()};
	this.bn.onclick = function(){_this.dayNight()};
	this.b0.onclick = function(){_this.verticlaHorizon()};
	this.b1.onclick = function(){_this.textPlus()};
	this.b2.onclick = function(){_this.textMoin()};
	// drag zone
	this.zone = this.doc.getElementById('dragZone');
	this.zone.ondragover = function(){_this.zoneDragOver()};
    this.zone.ondragend = function(){_this.zoneDragEnd()};
    this.zone.ondrop = function(e){_this.zoneDrop()}
}

LTH.Menu.prototype = {
	constructor: LTH.Menu,
	init:function(startDemo){
		var name;
		for(var i=0; i < 4; i++){
			name = "demo_"+i+'.js';
			this.pushFile(name, '#cccc00');
			//testFile("demo_"+i+'.js');
			//if(i==0)testFile("demo_"+i+'_c.js');
		}
	    this.currentFile = startDemo || 0;
		this.main.loadFile('demos/'+this.files[this.currentFile]);
	    this.resetIcon();
	},
	/*testFile:function (name){
		var existe = false;
		var xhr;// = new XMLHttpRequest()
	    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();// Mozilla/Safari
	    else if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");// IE

		xhr.onerror = function () { xhr.abort(); };
		xhr.onreadystatechange = function() {
			if(this.readyState == 2) pushFile(name, '#cccc00');
			if(this.readyState == 4) xhr.abort();
		}
		xhr.open('GET', "../demos/"+name, true);
		xhr.send(null);
	},*/
	showCode:function(){
		if(this.main.showCode){
			this.main.showCode = false;
			this.bc.style.textDecoration = "none";
			this.b0.style.display = "none";
			this.b1.style.display = "none";
			this.b2.style.display = "none";
		}else{
			this.main.showCode = true;
			this.bc.style.textDecoration = "line-through";
			this.b0.style.display = "inline-block";
			this.b1.style.display = "inline-block";
			this.b2.style.display = "inline-block";
		}
		this.main.resize();
	},
	dayNight:function(){
		if(this.main.styleType=='day') this.isNight();
		else this.isDay();
		this.resetIcon(true);
		this.main.switchStyle();
	},
	verticlaHorizon:function(){
		if(this.main.viewType=='vertical'){
			this.main.viewType = 'horizon'; 
			this.b0.innerHTML = 'H';
		}else{
			this.main.viewType = 'vertical'; 
			this.b0.innerHTML = 'V';
		}
		this.main.resize();
	},
	textPlus:function(){
		this.main.scriptText ++;
		this.main.setTextSize();
	},
	textMoin:function(){
		this.main.scriptText --;
		this.main.setTextSize();
	},
	isDay:function(){
		this.doc.getElementById('logo').src="./images/logo.gif";
		this.main.styleType = 'day'; 
		this.bn.innerHTML = 'N';
		this.doc.body.className = '';
		this.bn.className = 'b';
		this.bc.className = 'b';
		this.b0.className = 'b';
		this.b1.className = 'b';
		this.b2.className = 'b';
		this.colorSelect = '#2b2e41';
		this.colorOver = 'rgba(0,0,0,0.3)';
	},
	isNight:function (){
		this.doc.getElementById('logo').src="./images/logon.png";
		this.main.styleType = 'night'; 
		this.bn.innerHTML = 'D';
		this.doc.body.className = 'night';
		this.bn.className = 'bn';
		this.bc.className = 'bn';
		this.b0.className = 'bn';
		this.b1.className = 'bn';
		this.b2.className = 'bn';
		this.colorSelect = '#D6D6D6';
		this.colorOver = 'rgba(255,255,255,0.3)';
	},
	zoneDragOver:function(){
		this.zone.className = 'hover'; 
		return false;
	},
	zoneDragEnd:function(){
		this.zone.className = ''; 
		return false;
	},
	zoneDrop:function(e){
		this.zone.className = '';
		e.preventDefault();
		var i;
	    if(e.dataTransfer.items){
	        i = e.dataTransfer.items.length;
	        while(i--){
	            var entry = e.dataTransfer.items[i].webkitGetAsEntry();
	            if (entry.isFile) {
	                this.addFile(e.dataTransfer.items[i].getAsFile());
	            } else if (entry.isDirectory) {
	                console.log('dir', e.dataTransfer.items[i].getAsFile(), entry.fullPath);
	            }
	        }
	    } else{
	        i = e.dataTransfer.files.length;
	        while(i--){
	            this.addFile(e.dataTransfer.files[i]);
	        }
	    }
	},
	addFile:function(file){
		var _this = this
	    var reader = new FileReader();
	    reader.onload = function (e){
	        var o = {};
	        o.name = file.name;
	        switch(o.name.substr(o.name.lastIndexOf(".")+1, o.name.length)){
	            case 'sea': o.t = 'sea'; o.c='#cccccc'; break;
	            case 'css': o.t = 'css'; o.c='#cc6600'; break;
	        }
	        switch(file.type){
	            case 'application/javascript': o.t='js'; o.c='#cccc00'; break;
	            case 'text/html': o.t='html'; o.c='#00cccc'; break;

	            case 'image/svg+xml': o.t='svg'; o.c='#cc3300'; break;
	            case 'image/png': o.t='png'; o.c='#cc0066'; break;
	            case 'image/jpeg': o.t='jpg'; o.c='#cc0033'; break;
	        }

	        o.file = file;
	        o.result = e.target.result;
	        _this.pushFile(o.name);
	    };
	    reader.readAsDataURL(file);
	},
	pushFile:function(name){
		var _this = this
		// don't add if same file
		var i = this.files.length;
		while(i--){ if(name == this.files[i]) return; }

	    var id = this.icons.length;
	    var ic = document.createElement('div');
	    ic.style.cssText = 'display:block; width:180px; height:30px; background-color:rgba(0,0,0,0); cursor:pointer; pointer-events:auto;';
	    var iner = document.createElement('div');
	    iner.style.cssText = 'position:relative; left:5px; top:5px; width:18px; height:18px; pointer-events:none; background-color: none; border:2px solid rgba(0,0,0,0);  border-radius:20px;';
	    var title = document.createElement('div');
	    title.style.cssText = 'position:relative; left:30px; top:-12px; width:140px; height:20px; pointer-events:none; text-align:right;';
	    var img = document.createElement('div');
	    img.style.cssText = 'position:relative; left:10px; top:-28px; width:8px; height:8px; pointer-events:none; background-color: '+this.colorSelect+';  border-radius:20px;';
	    title.innerHTML = name.substr(0, name.lastIndexOf("."));
	    ic.appendChild( iner );
	    ic.appendChild( title );
	    ic.appendChild( img );
	    this.zone.appendChild( ic );
	    ic.name = id;
	    ic.onclick =  function(e){_this.openFile(e)};
	    ic.ondblclick =  function(e){_this.openFile(e)};
	    ic.onmouseover =  function(e){_this.iconOver(e)};
	    ic.onmouseout =  function(e){_this.unselected(e)};
	    ic.onmouseup =  function(e){_this.unselected(e)};

	    ic.ondragstart =  function(e){_this.dragstart(e)};
	    ic.ondragend =  function(e){_this.dragend(e)};
	    
	    this.icons[id]=ic;
	    this.files[id]=name;
	},
	iconOver:function (e){
	    e.preventDefault();
	    var id = e.target.name;
	    if(id!==this.currentFile){
		    var child = this.icons[id].childNodes;
		    child[0].style.border ='2px solid ' + this.colorOver;
		}
	},
	unselected:function (e){
	    e.preventDefault();
	    var id = e.target.name;
	    if(id!==this.currentFile){
		    var child = this.icons[id].childNodes;
		    child[0].style.border ='2px solid rgba(0,0,0,0)';
		}
	},
	addIconLink:function (blob, name, type){
		window.URL = window.webkitURL || window.URL;
		if (this.currentLink){
		    window.URL.revokeObjectURL(this.currentLink.href);
		    this.currentLink=null;
		}
		this.currentLink = document.createElement('a');
		this.currentLink.style.cssText = "position:absolute; top:6px; right:65px; width:120px; height:20px; text-align:center;"
		this.currentLink.download = name;
		this.currentLink.href = window.URL.createObjectURL(blob);
		this.currentLink.dataset.downloadurl = [type, this.currentLink.download, this.currentLink.href].join(':');
	},
	dragstart:function (e){
		var id = e.target.name;
		if (e.target.classList.contains('dragout') && this.currentLink!==null) { e.dataTransfer.setData('DownloadURL', this.currentLink.dataset.downloadurl ); }
	},
	dragend:function (e){
		this.resetModified();
	},
	openFile:function (e){
	    e.preventDefault();
	    var id = e.target.name;
	    if(this.currentFile!==id){
	    	this.resetModified();
	        this.currentFile = id;
	    	this.main.loadFile('demos/'+this.files[id]);
	    	this.resetIcon();
	    }
	},
	resetIcon:function (plus){
		var i = this.icons.length, child;
		while(i--){
			child = this.icons[i].childNodes;
		    if(i==this.currentFile){
		    	if(i==this.inModif)child[0].style.border ='2px solid '+this.colorModif;
		    	else child[0].style.border ='2px solid '+this.colorSelect;
		    }
		    else child[0].style.border ='2px solid rgba(0,0,0,0)';
		    if(plus){
		    	if(i==this.inModif){
		    		child[1].style.color = this.colorModif;
		    		child[2].style.backgroundColor = this.colorModif;
		    	}else{
		    		child[1].style.color = this.colorSelect;
		    		child[2].style.backgroundColor = this.colorSelect;
		    	}
		    }
		}
	},
	modified:function(){
		this.inModif = this.currentFile;
		var child = this.icons[this.currentFile].childNodes;
		this.icons[this.currentFile].draggable = true;
		this.icons[this.currentFile].classList.add('dragout');
		child[0].style.border ='2px solid '+this.colorModif;
		child[1].style.color = this.colorModif;
		child[2].style.backgroundColor = this.colorModif;
		this.main.callSave();
	},
	resetModified:function(){
		this.inModif = -1;
		var i = this.icons.length, child;
		while(i--){
			this.icons[i].draggable = false;
			this.icons[i].classList.remove('dragout');
			child = this.icons[i].childNodes;
			if(i==this.currentFile)child[0].style.border ='1px solid '+this.colorSelect;
		    child[1].style.color = this.colorSelect;
		    child[2].style.backgroundColor = this.colorSelect;
		}
		if (this.currentLink){
		    window.URL.revokeObjectURL(this.currentLink.href);
		    this.currentLink=null;
		}
	}
}

//----------------------------------------
//    EDITOR
//----------------------------------------

LTH.CodeEditor = function(main){
	this.main = main;
	this.doc = document;
	this.editor = null;
	this.interval = null;
	this.mode = '';
	this.currentName = '';
	this.init();
}

LTH.CodeEditor.prototype = {
	constructor: LTH.CodeEditor,
	init:function(){
		this.editor = CodeMirror(this.doc.getElementById( 'editor' ), {
			//autofocus: true,
	        lineNumbers: true,
	        matchBrackets: true,
	        indentWithTabs: true,
	        styleActiveLine: true,
	        theme:'default',
	        mode:'text/javascript',
			tabSize: 4,
			indentUnit: 4,
			highlightSelectionMatches: {showToken: /\w/}
	    });
	    var _this = this;
	    this.editor.on('change', function() { _this.onChange() } );
	},
	onChange:function(){
		var _this = this;
		this.mode = this.editor.getOption('mode');
		//this.editor.autofocus = true;
		clearTimeout( this.interval );
		if(this.mode == 'htmlmixed'){
			var value = this.editor.getValue();
			if ( this.validate( value )) this.interval = setTimeout( function() {_this.main.update(value);}, 500);
		} else {
			var value = this.editor.getValue();
			if ( this.validate( value )) this.interval = setTimeout( function() {_this.main.update(value, true);}, 500);
		}
	},
	changeTheme:function(n){
		if(n==0) this.editor.setOption("theme", "default");
		else this.editor.setOption("theme", "monokai");
	},
	refresh:function(){
	    this.editor.refresh();
	},
	changeFontSize:function(size){
	    this.editor.getWrapperElement().style["font-size"] = size+"px";
	    this.refresh();
	},
	close:function (){
		this.editor.getInputField().blur();
	},
	loadfile:function(url){
		var type = url.substring(url.lastIndexOf(".")+1, url.length);
		this.currentName = url.substring(url.lastIndexOf("/")+1,url.lastIndexOf(".") );
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "./"+url, true);
		xhr.responseType = 'blob';
		var _this = this;
		xhr.onload = function(e) {
		    var reader = new FileReader();
		    reader.onload = function(e) {
		    	if(type=='html') _this.editor.setOption("mode", 'htmlmixed' );
	        	else if(type=='js') _this.editor.setOption("mode", "text/javascript" );
		    	_this.editor.setValue(e.target.result);
		    }
		    reader.readAsText(this.response);
		}
		xhr.send();
	},
	openFile:function(o){
		this.currentName = o.name;
		var reader = new FileReader();
		var _this = this;
        reader.onload = function(e) {
        	if(o.t=='html') _this.editor.setOption("mode", 'htmlmixed' );
        	else if(o.t=='js') _this.editor.setOption("mode", 'text/javascript' );
            _this.editor.setValue(e.target.result);
        }
        reader.readAsText(o.file);
	},
	save:function() {
		var type, ex;
		if(this.mode == 'htmlmixed'){
			type = 'text/html;charset=utf-8';
			ex = '.html';
		} else {
			type = 'application/text/javascript;charset=utf-8';
			ex = '.js'
		}
		var blob = new Blob( [ this.editor.getValue() ], { type: type } );
		this.main.createLink(blob, this.currentName+ex, type);
	},
	validate:function( value ){
		var editor = this.editor;
		var mode = this.mode;
		var errorLines = [];
		var widgets = [];
		return editor.operation( function () {
			while ( errorLines.length > 0 ) {
				editor.removeLineClass( errorLines.shift(), 'background', 'errorLine' );
			}
			for ( var i = 0; i < widgets.length; i ++ ) {
				editor.removeLineWidget( widgets[ i ] );
			}
			widgets.length = 0;
			var string;
			if(mode == 'htmlmixed'){
			    // remove html
				string = '\n';
				var lines = value.split( '\n' );
				var lineCurrent = 0, lineTotal = lines.length;
				while ( lineCurrent < lineTotal && lines[ lineCurrent ].indexOf( '<script>' ) === -1 ) {
					string += '\n';
					lineCurrent ++;
				}
				var lineStart = lineCurrent ++;
				while ( lineCurrent < lineTotal && lines[ lineCurrent ].indexOf( '<\/script>' ) === -1 ) {
					string += lines[ lineCurrent ] + '\n';
					lineCurrent ++;
				}
			} else {
				string = value;
			}
			try {
				var result = esprima.parse( string, { tolerant: true } ).errors;
				for ( var i = 0; i < result.length; i ++ ) {
					var error = result[ i ];
					var message = document.createElement( 'div' );
					message.className = 'esprima-error';
					message.textContent = error.message.replace(/Line [0-9]+: /, '');
					var lineNumber = error.lineNumber - 1;
					errorLines.push( lineNumber );
					editor.addLineClass( lineNumber, 'background', 'errorLine' );
					var widget = editor.addLineWidget( lineNumber, message );
					widgets.push( widget );
				}
			} catch ( error ) {
				var message = document.createElement( 'div' );
				message.className = 'esprima-error';
				message.textContent = error.message.replace(/Line [0-9]+: /, '');
				var lineNumber = error.lineNumber - 1;
				errorLines.push( lineNumber );
				editor.addLineClass( lineNumber, 'background', 'errorLine' );
				var widget = editor.addLineWidget( lineNumber, message );
				widgets.push( widget );
			}
			return errorLines.length === 0;
		});
	}
}