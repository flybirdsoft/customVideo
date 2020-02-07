/*

write by wuweiwei (邬畏畏)
component function :
this component is work for HTML5 Video to controll video play pause and play speed and so on
github: 
www.flybirdsoft.com/flybirdsoft
www.flybirdsoft.com/wing
www.flybirdsoft.com/wui
www.github.com/flybirdsoft
*/

(function(){

var CustomVideo = function(videoNode){
	this.isShowSpeed = false;     /*是否显示倍速菜单*/
	this.isShowTextTrack = false; /*是否显示字幕菜单*/
	this.currentTime = 0; /*currentTime is video play time*/
	/*videoState for IE*/
	this.videoState = {
		parentWidth:"",
		parentHeight:"",
		width:"",
		height:""
	};
	this.isFullScreen = false;
	this.isMute = false;
	this.currentVolume = 50;/*the video volume is 0.0-1.0 ,currentVolume is 0--100*/
	this.data={
		durationDiff:1,
		trackBarDiff:1,
		minutes:0,
		seconds:0,
		moveMinutes:0,
		moveSeconds:0
	};
	this.dataOptions = {};
	this.data.durationDiff = 1;
	this.videoNode = videoNode;
	this.renderElement(videoNode);
	this.initVideoTrackEvent();
	this.initVideoVolumeEvent();
	this.initEvent();
	this.initVideoEvent();
	this.videoNode.volume = 0.5;

	var userAgent = navigator.userAgent;
	if(userAgent.indexOf("IE")>0||userAgent.indexOf("Trident")>0)/*isIE*/
	{
		this.videoState.parentWidth = this.videoNode.parentNode.offsetWidth;
		this.videoState.parentHeight = this.videoNode.parentNode.offsetHeight;
		this.videoState.width = this.videoNode.offsetWidth;
		this.videoState.height = this.videoNode.offsetHeight;
	}
	this.initTextTrack();
}
CustomVideo.prototype.loadSrc = function(src){
	this.videoNode.setAttribute("src",src);
	this.videoNode.volume = 0.5;
	this.initTextTrack();
}
CustomVideo.prototype.setVideoTime = function(currentDuration,duration){
	var durationHTML;
	this.data.minutes = Math.floor (duration / 60);
	this.data.seconds = (duration % 60).toFixed (0);
	if(!!currentDuration)
	{
		this.data.moveMinutes = Math.floor (currentDuration / 60);
		this.data.moveSeconds = (currentDuration % 60).toFixed (0);
	}
	else
	{
		this.data.moveMinutes = "0";
		this.data.moveSeconds = "00";
	}
	if(isNaN(this.data.minutes)||isNaN(this.data.seconds))
	{
		durationHTML = "";
	}
	else
	{
		durationHTML = this.data.moveMinutes+":"+this.data.moveSeconds+"/"+this.data.minutes+":"+this.data.seconds;		
	}
	this.controll.timeButton.innerHTML = durationHTML;
}

/*set play prograss bar position*/
CustomVideo.prototype.setTrackPosition = function(_currentTime){
	/*
	parems:
	currentTime is crrent play seconds
	*/
	var pos,currentTime;
	currentTime = _currentTime;
	if(!!!currentTime)
	{
		currentTime = this.currentTime;
	}
	pos = (currentTime/this.data.durationDiff)*this.data.trackBarDiff;
	this.controll.controllTrackBall.style.left = Math.max(0,Math.floor(pos)-10) + "px";
	this.controll.controllTrackOver.style.width = Math.max(0, Math.floor(pos))+ 'px';
}
CustomVideo.prototype.getTrackBarDiff = function(){
	this.data.trackBarDiff = this.videoParent.offsetWidth/100;
}

/*设置播放倍速*/
CustomVideo.prototype.setRate = function(v){
	this.videoNode.playbackRate = v;
}

CustomVideo.prototype.initVideoEvent = function(){
	var th = this;

	this.videoNode.onprogress = function(e){
		setTimeout(function(){
			th.controll.loading.style.display = "none";
		},500);
	}
	this.videoNode.onwaiting = function(e){
		th.controll.loading.style.display = "block";
	}
	this.videoNode.onplaying = function(e){
		setTimeout(function(){
			th.controll.loading.style.display = "none";
		},500);
	}
	this.videoNode.onerror = function(e){
	}
	this.videoNode.onseeking = function(e){
		th.controll.loading.style.display = "block";
	}
	this.videoNode.onplay = function(e){
		th.controll.playButton.style.display = "none";
		th.controll.pauseButton.style.display = "block";
	}
	this.videoNode.onpause = function(e){
		th.controll.playButton.style.display = "block";
		th.controll.pauseButton.style.display = "none";		
	}
	/*get video time length*/
	this.videoNode.onloadedmetadata = function(e){
		th.data.durationDiff = this.duration/100;
		th.data.trackBarDiff = th.videoParent.offsetWidth/100;
		console.log(this.duration);
		th.setVideoTime(undefined,this.duration);
	}
	this.videoNode.onloadeddata = function(){

	}
	this.videoNode.ontimeupdate = function(e){
		th.currentTime = this.currentTime;
		th.setVideoTime(this.currentTime,this.duration);
		th.setTrackPosition(this.currentTime);
	}
}
CustomVideo.prototype.initEvent = function(){
	var th = this;
	var parentNode = this.videoNode.parentNode;
	parentNode.onclick = function(e){

	}
	parentNode.onmouseover = function(e){
		th.controll.controllBack.style.display = "block";
		th.controll.controllPanel.style.display = "block";
		if(!th.isShowSpeed)
		{
			th.controll.speedMenu.style.display = "none";
		}
		else
		{
			th.controll.speedMenu.style.display = "block";
		}
		if(!th.isShowTextTrack)
		{
			th.controll.textTrack.style.display = "none";
		}
		else
		{
			th.controll.textTrack.style.display = "block";
		}
	}
	parentNode.onmouseout = function(e){
		th.controll.controllBack.style.display = "none";
		th.controll.controllPanel.style.display = "none";
		th.controll.speedMenu.style.display = "none";
		th.controll.textTrack.style.display = "none";
	}
	this.controll.speedButton.onclick = function(e){
		th.controll.speedMenu.style.display = "block";
		th.isShowSpeed = true;
		th.controll.textTrack.style.display = "none";
		th.isShowTextTrack = false;
	}
	this.controll.moreMenu.onclick = function(e){
		th.controll.textTrack.style.display = "block";
		th.isShowTextTrack = true;
		th.controll.speedMenu.style.display = "none";
		th.isShowSpeed = false;
	}
	this.controll.speedMenu.onclick = function(e){
		var target = (e.srcElement||e.target);
		var i,speedMenuChild =this.childNodes;
		var len = speedMenuChild.length;
		this.style.display = "none";
		th.isShowSpeed = false;
		for(i=0;i<len;i++)
		{
			if(speedMenuChild[i].nodeType==1)
			{
				speedMenuChild[i].className = "";
			}
		}
		target.className = "cv-menu-select";
		if(target.nodeName=="DD")
		{
			th.setRate(target.getAttribute("value"));
		}
	}
	this.controll.textTrack.onclick = function(e){
		var target = (e.srcElement||e.target);
		var i,moreMenuChild =this.childNodes;
		var len = moreMenuChild.length;
		this.style.display = "none";
		th.isShowTextTrack = false;
		for(i=0;i<len;i++)
		{
			if(moreMenuChild[i].nodeType==1)
			{
				moreMenuChild[i].className = "";
			}
		}
		target.className = "cv-texttrack-select";
		if(target.nodeName=="DD")
		{
			th.setTextTack(target.getAttribute("language"));
		}
	}
	this.controll.fullScreenButton.onclick = function(e){
		var userAgent = navigator.userAgent;
		if(userAgent.indexOf("IE")>0||userAgent.indexOf("Trident")>0)/*isIE*/
		{
			if(!th.isFullScreen)
			{
				th.fullScreen();
				th.isFullScreen = true;
			}
			else
			{
				th.exitScreen();
				th.isFullScreen = false;
			}			
		}
		else
		{
			th.fullScreen();
		}
	}
	this.controll.playButton.onclick = function(e){
		try
		{
			this.style.display = "none";
			th.controll.pauseButton.style.display = "block";
			th.videoNode.play();
		}
		catch(e)
		{

		}
	}
	this.controll.pauseButton.onclick = function(e){
		try
		{
			this.style.display = "none";
			th.controll.playButton.style.display = "block";
			th.videoNode.pause();
		}
		catch(e)
		{}
	}
	this.controll.volumeIcon.onclick = function(e){
		th.setMute(th.isMute);
	}
}

CustomVideo.prototype.renderElement = function(videoNode){
	this.controll = {
		controllBack:null,
		controllPanel:null,
	};
	this.videoNode = videoNode;
	this.videoParent = this.videoNode.parentNode;
	this.videoParent.style.position = "relative";
	this.controll.controllBack = document.createElement("div");
	this.controll.controllBack.className = "controllBack";
	this.controll.controllBack.style.height = "50px";
	this.controll.controllBack.style.background = "#333";
	this.controll.controllBack.style.position = "absolute";
	this.controll.controllBack.style.bottom = "0";
	this.controll.controllBack.style.width = "100%";
	this.controll.controllBack.style.opacity = 0.8;
	this.controll.controllBack.style.display = "none";

	this.controll.controllPanel = document.createElement("div");
	this.controll.controllPanel.className = "controllPanel";
	this.controll.controllPanel.style.height = "40px";
	this.controll.controllPanel.style.paddingTop = "5px";
	this.controll.controllPanel.style.paddingBottom = "5px";
	this.controll.controllPanel.style.position = "absolute";
	this.controll.controllPanel.style.bottom = "0";
	this.controll.controllPanel.style.width = "100%";
	this.controll.controllPanel.style.display = "none";

	this.controll.controllTrack = document.createElement("div");
	this.controll.controllTrack.className = "controllTrack";
	this.controll.controllTrack.style.height = "8px";
	this.controll.controllTrack.style.position = "absolute";
	this.controll.controllTrack.style.background = "#111";
	this.controll.controllTrack.style.top = "5px";
	this.controll.controllTrack.style.width = "100%";
	this.controll.controllTrack.style.width = this.videoParent.offsetWidth;
	this.controll.controllTrack.style.borderRadius = "4px";

	this.controll.controllTrackBall = document.createElement("div");
	this.controll.controllTrackBall.className = "controllTrackBall";
	this.controll.controllTrackBall.style.cursor = "pointer";
	this.controll.controllTrackBall.style.height = "10px";
	this.controll.controllTrackBall.style.position = "absolute";
	this.controll.controllTrackBall.style.background = "#eee";
	this.controll.controllTrackBall.style.top = "-1px";
	this.controll.controllTrackBall.style.width = "10px";
	this.controll.controllTrackBall.style.borderRadius = "10px";

	this.controll.controllTrackOver = document.createElement("div");
	this.controll.controllTrackOver.className = "controllTrackOver";
	this.controll.controllTrackOver.style.height = "8px";
	this.controll.controllTrackOver.style.position = "absolute";
	this.controll.controllTrackOver.style.background = "#999";
	this.controll.controllTrackOver.style.top = "0px";
	this.controll.controllTrackOver.style.width = "0px";
	this.controll.controllTrackOver.style.borderRadius = "4px";

	this.controll.controllTrack.appendChild(this.controll.controllTrackOver);
	this.controll.controllTrack.appendChild(this.controll.controllTrackBall);

	this.controll.controllButtons = document.createElement("div");
	this.controll.controllButtons.className = "controllButtons";
	this.controll.controllButtons.style.position = "absolute";
	this.controll.controllButtons.style.top = "20px";
	this.controll.controllButtons.style.height = "40px";
	this.controll.controllButtons.style.paddingLeft = "5px";
	this.controll.controllButtons.style.paddingRight = "5px";
	this.controll.controllButtons.style.width = "100%";

	this.controll.playButton = document.createElement("div");
	this.controll.playButton.className = "playButton";
	this.controll.playButton.style.cssFloat = "left";
	this.controll.playButton.style.marginRight = "10px";
	this.controll.playButton.style.height = "20px";
	this.controll.playButton.style.width = "20px";
	this.controll.playButton.innerHTML = '<span \
										style="display:block;border-left:20px solid #ddd;border-top:10px solid transparent;border-bottom:10px solid transparent;">\
										</span>';
	this.controll.playButton.style.cursor = "pointer";

	this.controll.pauseButton = document.createElement("div");
	this.controll.pauseButton.className = "pauseButton";
	this.controll.pauseButton.style.cssFloat = "left";
	this.controll.pauseButton.style.marginRight = "10px";
	this.controll.pauseButton.style.height = "20px";
	this.controll.pauseButton.style.width = "20px";
	//this.controll.pauseButton.style.background = "#ccc";
	this.controll.pauseButton.innerHTML = '<span style="background:#ddd;display:block;float:left;width:5px;height:100%;"></span>\
										   <span style="background:#ddd;display:block;float:left;width:5px;height:100%;margin-left:5px;"></span>';
	this.controll.pauseButton.style.cursor = "pointer";
	this.controll.pauseButton.style.display = "none";

	this.controll.volumeIcon = document.createElement("div");
	this.controll.volumeIcon.className = "volumeIcon";
	this.controll.volumeIcon.style.cssFloat = "left";
	this.controll.volumeIcon.style.marginRight = "10px";
	this.controll.volumeIcon.style.height = "20px";
	this.controll.volumeIcon.style.width = "30px";
	this.controll.volumeIcon.innerHTML='    <svg viewBox="0 0 100 77" xmlns="http://www.w3.org/2000/svg">\
        <path id="cv_speakB" class="volElem" stroke="#9E7818" d="M51.2,18.5v-13c0-2.1-2.5-3.3-4.1-1.9L21.8,25.9c-1.4,1.2-3.1,1.9-4.9,1.9H8.2c-2.3,0-4.2,1.9-4.2,4.2v13.3c0,2.3,1.9,4.2,4.2,4.2H17c1.9,0,3.7,0.7,5.1,1.9l25,22c1.6,1.4,4.1,0.3,4.1-1.9v-13" opacity="0.4"/>\
        <path id="cv_speakF" fill="#ddd" class="volElem" stroke-width="0" d="M51.2,18.5v-13c0-2.1-2.5-3.3-4.1-1.9L21.8,25.9c-1.4,1.2-3.1,1.9-4.9,1.9H8.2c-2.3,0-4.2,1.9-4.2,4.2v13.3c0,2.3,1.9,4.2,4.2,4.2H17c1.9,0,3.7,0.7,5.1,1.9l25,22c1.6,1.4,4.1,0.3,4.1-1.9v-13"/>\
        <path id="cv_arcBigF" class="volElem" fill-opacity="0.0" stroke-width="5" stroke="#DDD" d="M72.2,64.1C81.1,59,87,49.4,87,38.5c0-10.9-5.9-20.5-14.8-25.6"/>\
        <path id="cv_arcSmF" class="volElem" fill-opacity="0.0" stroke-width="5" stroke="#DDD" d="M59,51.3c4.4-2.6,7.4-7.4,7.4-12.8s-3-10.3-7.4-12.8"/>\
        <line id="cv_crossLtRb" class="volElem" opacity="1.0" stroke-width="8" stroke="#eee" x1="15" y1="10" x2="80" y2="70" transform="scale(0)" />\
        <line id="cv_crossLbRt" class="volElem" opacity="0.6" stroke="#CE9610" x1="62.6" y1="29.2" x2="43.8" y2="47.8" transform="scale(0)" />\
    </svg>';
    this.controll.volumeIcon.style.cursor = "pointer";

	this.controll.volume = document.createElement("div");
	this.controll.volume.className = "volume";
	this.controll.volume.style.position = "relative";
	this.controll.volume.style.cssFloat = "left";
	this.controll.volume.style.marginRight = "10px";
	this.controll.volume.style.marginTop = "8px";
	this.controll.volume.style.height = "6px";
	this.controll.volume.style.width = "15%";
	this.controll.volume.style.borderRadius = "4px";
	this.controll.volume.style.background = "#111";

	this.controll.volumeOver = document.createElement("div");
	this.controll.volumeOver.className = "volumeOver";
	this.controll.volumeOver.style.position = "absolute";
	this.controll.volumeOver.style.cssFloat = "left";
	this.controll.volumeOver.style.height = "6px";
	this.controll.volumeOver.style.width = "50%";
	this.controll.volumeOver.style.borderRadius = "4px";
	this.controll.volumeOver.style.background = "#999";

	this.controll.volumeBall = document.createElement("div");
	this.controll.volumeBall.className = "volumeBall";
	this.controll.volumeBall.style.position = "absolute";
	this.controll.volumeBall.style.top = "-2px";
	this.controll.volumeBall.style.left = "48%";
	this.controll.volumeBall.style.height = "10px";
	this.controll.volumeBall.style.width = "10px";
	this.controll.volumeBall.style.borderRadius = "5px";
	this.controll.volumeBall.style.cursor = "pointer";
	this.controll.volumeBall.style.background = "#eee";
	this.controll.volume.appendChild(this.controll.volumeOver);
	this.controll.volume.appendChild(this.controll.volumeBall);

	this.controll.timeButton = document.createElement("div");
	this.controll.timeButton.className = "timeButton";
	this.controll.timeButton.style.cssFloat = "left";
	this.controll.timeButton.style.marginRight = "10px";
	this.controll.timeButton.style.height = "20px";
	this.controll.timeButton.style.width = "100px";
	this.controll.timeButton.style.color = "#FFF";
	//this.controll.timeButton.style.background = "#aaa";

	this.controll.speedButton = document.createElement("div");
	this.controll.speedButton.className = "speedButton";
	this.controll.speedButton.style.cssFloat = "right";
	this.controll.speedButton.style.marginRight = "10px";
	this.controll.speedButton.style.height = "20px";
	this.controll.speedButton.innerHTML = "Speed";
	this.controll.speedButton.style.color = "#ddd";
	this.controll.speedButton.style.position = "relative";
	this.controll.speedButton.style.cursor = "pointer";

	this.controll.fullScreenButton = document.createElement("div");
	this.controll.fullScreenButton.className = "fullScreenButton";
	this.controll.fullScreenButton.style.cssFloat = "right";
	this.controll.fullScreenButton.style.marginRight = "10px";
	this.controll.fullScreenButton.style.height = "20px";
	this.controll.fullScreenButton.style.width = "20px";
	this.controll.fullScreenButton.style.background = "transparent";
	this.controll.fullScreenButton.style.border = "2px solid #ddd";
	this.controll.fullScreenButton.style.cursor = "pointer";

	this.controll.moreMenu = document.createElement("div");
	this.controll.moreMenu.className = "moreMenu";
	this.controll.moreMenu.style.cssFloat = "right";
	this.controll.moreMenu.style.marginRight = "10px";
	this.controll.moreMenu.style.height = "20px";
	this.controll.moreMenu.style.width = "10px";
	this.controll.moreMenu.innerHTML = '<div style="width:4px;height:4px;background:#ddd;border-radius:6px;margin-top:3px;"></div>\
										<div style="width:4px;height:4px;background:#ddd;border-radius:6px;margin-top:3px;"></div>\
										<div style="width:4px;height:4px;background:#ddd;border-radius:6px;margin-top:3px;"></div>';
	this.controll.moreMenu.style.cursor = "pointer";

	this.controll.controllButtons.appendChild(this.controll.playButton);
	this.controll.controllButtons.appendChild(this.controll.pauseButton);
	this.controll.controllButtons.appendChild(this.controll.volumeIcon);
	this.controll.controllButtons.appendChild(this.controll.volume);
	this.controll.controllButtons.appendChild(this.controll.timeButton);
	this.controll.controllButtons.appendChild(this.controll.moreMenu);
	this.controll.controllButtons.appendChild(this.controll.fullScreenButton);
	this.controll.controllButtons.appendChild(this.controll.speedButton);

	this.controll.speedMenu = document.createElement("dl");
	this.controll.speedMenu.className = "speedMenu";
	this.controll.speedMenu.style.margin = "0";
	this.controll.speedMenu.style.padding = "0";
	this.controll.speedMenu.style.color = "#FFF";
	this.controll.speedMenu.style.width = "150px";
	this.controll.speedMenu.style.cursor = "pointer";
	this.controll.speedMenu.style.position = "absolute";
	this.controll.speedMenu.style.bottom = "55px";
	this.controll.speedMenu.style.right = "5px";
	this.controll.speedMenu.style.background = "#333";
	this.controll.speedMenu.style.opacity = 0.9;
	this.controll.speedMenu.style.display = "none";
	this.controll.speedMenu.innerHTML = '\
											<dd value="0.5">0.5x</dd>\
											<dd value="1.0" class="cv-menu-select">1.0x</dd>\
											<dd value="1.25">1.25x</dd>\
											<dd value="1.5">1.5x</dd>\
											<dd value="2">2x</dd>\
										';

	this.controll.textTrack = document.createElement("dl");
	this.controll.textTrack.className = "textTrack";
	this.controll.textTrack.style.margin = "0";
	this.controll.textTrack.style.padding = "0";
	this.controll.textTrack.style.color = "#FFF";
	this.controll.textTrack.style.width = "auto";
	this.controll.textTrack.style.cursor = "pointer";
	this.controll.textTrack.style.position = "absolute";
	this.controll.textTrack.style.bottom = "55px";
	this.controll.textTrack.style.right = "5px";
	this.controll.textTrack.style.background = "#333";
	this.controll.textTrack.style.opacity = 0.9;
	this.controll.textTrack.style.display = "none";

	this.controll.controllPanel.appendChild(this.controll.controllTrack);
	this.controll.controllPanel.appendChild(this.controll.controllButtons);

	this.videoParent.appendChild(this.controll.controllBack);
	this.videoParent.appendChild(this.controll.controllPanel);
	this.videoParent.appendChild(this.controll.speedMenu);
	this.videoParent.appendChild(this.controll.textTrack);

	this.controll.loading = document.createElement("div");
	this.controll.loading.className = "loading";
	this.controll.loading.style.position = "absolute";
	this.controll.loading.style.display = "none";
	this.controll.loading.style.left = "47%";
	this.controll.loading.style.top = "50%";
	this.controll.loading.style.fontWeight = "bold";
	this.controll.loading.innerHTML = "<span style='color:#F00'>Load</span><span style='color:#00F'>ing...</span>";
	this.videoParent.appendChild(this.controll.loading);
}
CustomVideo.prototype.initVideoTrackEvent = function(){
	var f = this, g = document, b = window, m = Math;
	f.controll.controllTrackBall.onmousedown = function (e) {
		var x = (e || b.event).clientX;
		var l = this.offsetLeft;
		var max = f.controll.controllTrack.offsetWidth - this.offsetWidth;

		g.onmousemove = function (e) {
			var thisX = (e || b.event).clientX;
			var to = m.min(max, m.max(-2, l + (thisX - x)));
			//var to = m.min(max, m.max(f.baseValue.min, l + (thisX - x)));
			f.controll.controllTrackBall.style.left = to + 'px';
			f.onTrackDrag(m.round(m.max(0, to / max) * 100), to);
			b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
		};
		g.onmouseup = new Function('this.onmousemove=null');
	};
}
CustomVideo.prototype.onTrackDrag = function(value, x){
	this.controll.controllTrackOver.style.width = (Math.max(0, x) +10)+ 'px';
	this.controll.controllTrackBall.style.left = x + 'px';
	this.setDuration(value);
}

CustomVideo.prototype.initVideoVolumeEvent = function(){
	var f = this, g = document, b = window, m = Math;
	f.controll.volumeBall.onmousedown = function (e) {
		var x = (e || b.event).clientX;
		var l = this.offsetLeft;
		var max = f.controll.volume.offsetWidth - this.offsetWidth;

		g.onmousemove = function (e) {
			var thisX = (e || b.event).clientX;
			var to = m.min(max, m.max(-2, l + (thisX - x)));
			//var to = m.min(max, m.max(f.baseValue.min, l + (thisX - x)));
			f.controll.volumeBall.style.left = to + 'px';
			f.onVolumeDrag(m.round(m.max(0, to / max) * 100), to);
			b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
		};
		g.onmouseup = new Function('this.onmousemove=null');
	};
}
CustomVideo.prototype.onVolumeDrag = function(value, x){
	this.controll.volumeOver.style.width = (Math.max(0, x) +5)+ 'px';
	this.controll.volumeBall.style.left = x + 'px';
	this.currentVolume = value; /*value is 0--100*/
	this.setVolume(value);
	if(value<1)
	{
		this.setMute(false);
	}
	else
	{
		this.setMute(true);
	}
}

/*set current video time*/
CustomVideo.prototype.setDuration = function(v){
	this.videoNode.currentTime = v*this.data.durationDiff;
	this.setVideoTime(this.videoNode.currentTime,this.videoNode.duration);
}
/*set current video volume*/
CustomVideo.prototype.setVolume = function(v){
	this.videoNode.volume = v/100;
}



CustomVideo.prototype.fullScreen = function() {
    var ele = this.videoNode;
    
    if (ele.requestFullscreen)
    {
        ele.requestFullscreen();
    }
    else if(ele.mozRequestFullScreen)
    {
        ele.mozRequestFullScreen();
    }
    else if (ele.webkitRequestFullScreen)
    {
        ele.webkitRequestFullScreen();
    }
    
    var userAgent = (navigator.userAgent);
    if(userAgent.indexOf("IE")>0||userAgent.indexOf("Trident")>0)/*isIE*/
    {
    	var body = document.getElementsByTagName("body")[0];
    	body.style.overflow = "hidden";
    	this.videoParent.style.position = "fixed";
    	this.videoParent.style.left = "0px";
    	this.videoParent.style.top = "0px";
    	this.videoParent.style.margin = "0";
    	this.videoParent.style.padding = "0";	
    	this.videoParent.style.width = "100%";
    	this.videoParent.style.height = "100%";
    	this.videoNode.style.width = "100%";
    	this.videoNode.style.height = "100%";
    	this.controll.controllTrack.style.width = this.videoParent.offsetWidth+"px";
    	this.getTrackBarDiff();
    	this.setTrackPosition();
    }
}

CustomVideo.prototype.exitScreen = function() {
    var ele = this.videoNode;
    
    if (ele.exitFullscreen)
    {
        ele.exitFullscreen();
    }
    else if(ele.mozCancelFullScreen)
    {
        ele.mozCancelFullScreen();
    }
    else if (ele.webkitCancelFullScreen)
    {
        ele.webkitCancelFullScreen();
    }
    
    var userAgent = (navigator.userAgent);
    if(userAgent.indexOf("IE")>0||userAgent.indexOf("Trident")>0)/*isIE*/
    {
    	var body = document.getElementsByTagName("body")[0];
    	body.style.overflow = "";
    	this.videoParent.style.position = "relative";   	
    	this.videoParent.style.width = this.videoState.parentWidth;
    	this.videoParent.style.height = this.videoState.parentHeight;
    	this.videoNode.style.width = this.videoState.width;
    	this.videoNode.style.height = this.videoState.height;
    	this.controll.controllTrack.style.width = this.videoState.parentWidth+"px";
    	this.getTrackBarDiff();
    	this.setTrackPosition();
    }
}
CustomVideo.prototype.setMute = function(isMute) {
	var cv_arcBigF = document.getElementById("cv_arcBigF");
	var cv_arcSmF = document.getElementById("cv_arcSmF");
	
	if(isMute)
	{
		cv_arcBigF.style.display = "block";
		cv_arcSmF.style.display = "block";
		this.controll.volumeOver.style.width = this.currentVolume+"%";
		this.controll.volumeBall.style.left = (this.currentVolume-2)+"%";
		this.videoNode.volume = this.currentVolume/100;
		this.isMute = false;
	}
	else
	{
		/*图标显示静音*/
		cv_arcBigF.style.display = "none";
		cv_arcSmF.style.display = "none";
		this.controll.volumeOver.style.width = "0%";
		this.controll.volumeBall.style.left = "-2%";
		this.videoNode.volume = 0;
		this.isMute = true;
	}
}

//////tack操作//////////////

CustomVideo.prototype.initTextTrack = function() {
	var trackList , i;
	var trackHtml = '',trackAr = [] , trackItem,trackItemTpl='';
	trackList = this.videoNode.textTracks;
	console.log(trackList);
	trackItem 
	for(i=0;i<trackList.length;i++)
	{
		trackItemTpl = '<dd language="{language}" class="{className}"><span></span>{label}</dd>';
		trackItem = trackItemTpl.replace("{language}",trackList[i].language);
		trackItem = trackItem.replace("{className}",trackList[i].mode=="showing"?"cv-texttrack-select":"");
		trackItem = trackItem.replace("{label}",trackList[i].label);
		trackAr.push(trackItem);
	}
	trackHtml = trackAr.join("");
	this.controll.textTrack.innerHTML = trackHtml;
}
CustomVideo.prototype.setTextTack = function(language) {
	var trackList = this.videoNode.textTracks;
	var i;
	for(i=0;i<trackList.length;i++)
	{
		if(trackList[i].language==language)
		{
			trackList[i].mode = "showing";
		}
		else
		{
			trackList[i].mode = "disabled";
		}
	}
}
window.CustomVideo = CustomVideo;
})();

