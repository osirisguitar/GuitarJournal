var Chart=function(s){function v(a,c,b){a=A((a-c.graphMin)/(c.steps*c.stepValue),1,0);return b*c.steps*a}function x(a,c,b,e){function h(){g+=f;var k=a.animation?A(d(g),null,0):1;e.clearRect(0,0,q,u);a.scaleOverlay?(b(k),c()):(c(),b(k));if(1>=g)D(h);else if("function"==typeof a.onAnimationComplete)a.onAnimationComplete()}var f=a.animation?1/A(a.animationSteps,Number.MAX_VALUE,1):1,d=B[a.animationEasing],g=a.animation?0:1;"function"!==typeof c&&(c=function(){});D(h)}function C(a,c,b,e,h,f){var d;a=
Math.floor(Math.log(e-h)/Math.LN10);h=Math.floor(h/(1*Math.pow(10,a)))*Math.pow(10,a);e=Math.ceil(e/(1*Math.pow(10,a)))*Math.pow(10,a)-h;a=Math.pow(10,a);for(d=Math.round(e/a);d<b||d>c;)a=d<b?a/2:2*a,d=Math.round(e/a);c=[];z(f,c,d,h,a);return{steps:d,stepValue:a,graphMin:h,labels:c}}function z(a,c,b,e,h){if(a)for(var f=1;f<b+1;f++)c.push(E(a,{value:(e+h*f).toFixed(0!=h%1?h.toString().split(".")[1].length:0)}))}function A(a,c,b){return!isNaN(parseFloat(c))&&isFinite(c)&&a>c?c:!isNaN(parseFloat(b))&&
isFinite(b)&&a<b?b:a}function y(a,c){var b={},e;for(e in a)b[e]=a[e];for(e in c)b[e]=c[e];return b}function E(a,c){var b=!/\W/.test(a)?F[a]=F[a]||E(document.getElementById(a).innerHTML):new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+a.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return c?
b(c):b}var r=this,B={linear:function(a){return a},easeInQuad:function(a){return a*a},easeOutQuad:function(a){return-1*a*(a-2)},easeInOutQuad:function(a){return 1>(a/=0.5)?0.5*a*a:-0.5*(--a*(a-2)-1)},easeInCubic:function(a){return a*a*a},easeOutCubic:function(a){return 1*((a=a/1-1)*a*a+1)},easeInOutCubic:function(a){return 1>(a/=0.5)?0.5*a*a*a:0.5*((a-=2)*a*a+2)},easeInQuart:function(a){return a*a*a*a},easeOutQuart:function(a){return-1*((a=a/1-1)*a*a*a-1)},easeInOutQuart:function(a){return 1>(a/=0.5)?
0.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)},easeInQuint:function(a){return 1*(a/=1)*a*a*a*a},easeOutQuint:function(a){return 1*((a=a/1-1)*a*a*a*a+1)},easeInOutQuint:function(a){return 1>(a/=0.5)?0.5*a*a*a*a*a:0.5*((a-=2)*a*a*a*a+2)},easeInSine:function(a){return-1*Math.cos(a/1*(Math.PI/2))+1},easeOutSine:function(a){return 1*Math.sin(a/1*(Math.PI/2))},easeInOutSine:function(a){return-0.5*(Math.cos(Math.PI*a/1)-1)},easeInExpo:function(a){return 0==a?1:1*Math.pow(2,10*(a/1-1))},easeOutExpo:function(a){return 1==
a?1:1*(-Math.pow(2,-10*a/1)+1)},easeInOutExpo:function(a){return 0==a?0:1==a?1:1>(a/=0.5)?0.5*Math.pow(2,10*(a-1)):0.5*(-Math.pow(2,-10*--a)+2)},easeInCirc:function(a){return 1<=a?a:-1*(Math.sqrt(1-(a/=1)*a)-1)},easeOutCirc:function(a){return 1*Math.sqrt(1-(a=a/1-1)*a)},easeInOutCirc:function(a){return 1>(a/=0.5)?-0.5*(Math.sqrt(1-a*a)-1):0.5*(Math.sqrt(1-(a-=2)*a)+1)},easeInElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(1==(a/=1))return 1;b||(b=0.3);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*
Math.PI)*Math.asin(1/e);return-(e*Math.pow(2,10*(a-=1))*Math.sin((1*a-c)*2*Math.PI/b))},easeOutElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(1==(a/=1))return 1;b||(b=0.3);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*Math.PI)*Math.asin(1/e);return e*Math.pow(2,-10*a)*Math.sin((1*a-c)*2*Math.PI/b)+1},easeInOutElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(2==(a/=0.5))return 1;b||(b=1*0.3*1.5);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*Math.PI)*Math.asin(1/e);return 1>a?-0.5*e*Math.pow(2,10*
(a-=1))*Math.sin((1*a-c)*2*Math.PI/b):0.5*e*Math.pow(2,-10*(a-=1))*Math.sin((1*a-c)*2*Math.PI/b)+1},easeInBack:function(a){return 1*(a/=1)*a*(2.70158*a-1.70158)},easeOutBack:function(a){return 1*((a=a/1-1)*a*(2.70158*a+1.70158)+1)},easeInOutBack:function(a){var c=1.70158;return 1>(a/=0.5)?0.5*a*a*(((c*=1.525)+1)*a-c):0.5*((a-=2)*a*(((c*=1.525)+1)*a+c)+2)},easeInBounce:function(a){return 1-B.easeOutBounce(1-a)},easeOutBounce:function(a){return(a/=1)<1/2.75?1*7.5625*a*a:a<2/2.75?1*(7.5625*(a-=1.5/2.75)*
a+0.75):a<2.5/2.75?1*(7.5625*(a-=2.25/2.75)*a+0.9375):1*(7.5625*(a-=2.625/2.75)*a+0.984375)},easeInOutBounce:function(a){return 0.5>a?0.5*B.easeInBounce(2*a):0.5*B.easeOutBounce(2*a-1)+0.5}},q=s.canvas.width,u=s.canvas.height;window.devicePixelRatio&&(s.canvas.style.width=q+"px",s.canvas.style.height=u+"px",s.canvas.height=u*window.devicePixelRatio,s.canvas.width=q*window.devicePixelRatio,s.scale(window.devicePixelRatio,window.devicePixelRatio));this.PolarArea=function(a,c){r.PolarArea.defaults={scaleOverlay:!0,
scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleShowLine:!0,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",
animateRotate:!0,animateScale:!1,onAnimationComplete:null};var b=c?y(r.PolarArea.defaults,c):r.PolarArea.defaults;return new G(a,b,s)};this.Radar=function(a,c){r.Radar.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleShowLine:!0,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!1,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",
scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,angleShowLineOut:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,pointLabelFontFamily:"'Arial'",pointLabelFontStyle:"normal",pointLabelFontSize:12,pointLabelFontColor:"#666",pointDot:!0,pointDotRadius:3,pointDotStrokeWidth:1,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Radar.defaults,c):r.Radar.defaults;return new H(a,b,s)};this.Pie=function(a,
c){r.Pie.defaults={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,onAnimationComplete:null};var b=c?y(r.Pie.defaults,c):r.Pie.defaults;return new I(a,b,s)};this.Doughnut=function(a,c){r.Doughnut.defaults={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:50,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,
onAnimationComplete:null};var b=c?y(r.Doughnut.defaults,c):r.Doughnut.defaults;return new J(a,b,s)};this.Line=function(a,c){r.Line.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:!0,
pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:2,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Line.defaults,c):r.Line.defaults;return new K(a,b,s)};this.Bar=function(a,c){r.Bar.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",
scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,barShowStroke:!0,barStrokeWidth:2,barValueSpacing:5,barDatasetSpacing:1,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Bar.defaults,c):r.Bar.defaults;return new L(a,b,s)};var G=function(a,c,b){var e,h,f,d,g,k,j,l,m;g=Math.min.apply(Math,[q,u])/2;g-=Math.max.apply(Math,[0.5*c.scaleFontSize,0.5*c.scaleLineWidth]);
d=2*c.scaleFontSize;c.scaleShowLabelBackdrop&&(d+=2*c.scaleBackdropPaddingY,g-=1.5*c.scaleBackdropPaddingY);l=g;d=d?d:5;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.length;f++)a[f].value>e&&(e=a[f].value),a[f].value<h&&(h=a[f].value);f=Math.floor(l/(0.66*d));d=Math.floor(0.5*(l/d));m=c.scaleShowLabels?c.scaleLabel:null;c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(m,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(l,f,d,e,h,
m);k=g/j.steps;x(c,function(){for(var a=0;a<j.steps;a++)if(c.scaleShowLine&&(b.beginPath(),b.arc(q/2,u/2,k*(a+1),0,2*Math.PI,!0),b.strokeStyle=c.scaleLineColor,b.lineWidth=c.scaleLineWidth,b.stroke()),c.scaleShowLabels){b.textAlign="center";b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;var e=j.labels[a];if(c.scaleShowLabelBackdrop){var d=b.measureText(e).width;b.fillStyle=c.scaleBackdropColor;b.beginPath();b.rect(Math.round(q/2-d/2-c.scaleBackdropPaddingX),Math.round(u/2-k*(a+
1)-0.5*c.scaleFontSize-c.scaleBackdropPaddingY),Math.round(d+2*c.scaleBackdropPaddingX),Math.round(c.scaleFontSize+2*c.scaleBackdropPaddingY));b.fill()}b.textBaseline="middle";b.fillStyle=c.scaleFontColor;b.fillText(e,q/2,u/2-k*(a+1))}},function(e){var d=-Math.PI/2,g=2*Math.PI/a.length,f=1,h=1;c.animation&&(c.animateScale&&(f=e),c.animateRotate&&(h=e));for(e=0;e<a.length;e++)b.beginPath(),b.arc(q/2,u/2,f*v(a[e].value,j,k),d,d+h*g,!1),b.lineTo(q/2,u/2),b.closePath(),b.fillStyle=a[e].color,b.fill(),
c.segmentShowStroke&&(b.strokeStyle=c.segmentStrokeColor,b.lineWidth=c.segmentStrokeWidth,b.stroke()),d+=h*g},b)},H=function(a,c,b){var e,h,f,d,g,k,j,l,m;a.labels||(a.labels=[]);g=Math.min.apply(Math,[q,u])/2;d=2*c.scaleFontSize;for(e=l=0;e<a.labels.length;e++)b.font=c.pointLabelFontStyle+" "+c.pointLabelFontSize+"px "+c.pointLabelFontFamily,h=b.measureText(a.labels[e]).width,h>l&&(l=h);g-=Math.max.apply(Math,[l,1.5*(c.pointLabelFontSize/2)]);g-=c.pointLabelFontSize;l=g=A(g,null,0);d=d?d:5;e=Number.MIN_VALUE;
h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(m=0;m<a.datasets[f].data.length;m++)a.datasets[f].data[m]>e&&(e=a.datasets[f].data[m]),a.datasets[f].data[m]<h&&(h=a.datasets[f].data[m]);f=Math.floor(l/(0.66*d));d=Math.floor(0.5*(l/d));m=c.scaleShowLabels?c.scaleLabel:null;c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(m,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(l,f,d,e,h,m);k=g/j.steps;x(c,function(){var e=2*Math.PI/
a.datasets[0].data.length;b.save();b.translate(q/2,u/2);if(c.angleShowLineOut){b.strokeStyle=c.angleLineColor;b.lineWidth=c.angleLineWidth;for(var d=0;d<a.datasets[0].data.length;d++)b.rotate(e),b.beginPath(),b.moveTo(0,0),b.lineTo(0,-g),b.stroke()}for(d=0;d<j.steps;d++){b.beginPath();if(c.scaleShowLine){b.strokeStyle=c.scaleLineColor;b.lineWidth=c.scaleLineWidth;b.moveTo(0,-k*(d+1));for(var f=0;f<a.datasets[0].data.length;f++)b.rotate(e),b.lineTo(0,-k*(d+1));b.closePath();b.stroke()}c.scaleShowLabels&&
(b.textAlign="center",b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily,b.textBaseline="middle",c.scaleShowLabelBackdrop&&(f=b.measureText(j.labels[d]).width,b.fillStyle=c.scaleBackdropColor,b.beginPath(),b.rect(Math.round(-f/2-c.scaleBackdropPaddingX),Math.round(-k*(d+1)-0.5*c.scaleFontSize-c.scaleBackdropPaddingY),Math.round(f+2*c.scaleBackdropPaddingX),Math.round(c.scaleFontSize+2*c.scaleBackdropPaddingY)),b.fill()),b.fillStyle=c.scaleFontColor,b.fillText(j.labels[d],0,-k*(d+
1)))}for(d=0;d<a.labels.length;d++){b.font=c.pointLabelFontStyle+" "+c.pointLabelFontSize+"px "+c.pointLabelFontFamily;b.fillStyle=c.pointLabelFontColor;var f=Math.sin(e*d)*(g+c.pointLabelFontSize),h=Math.cos(e*d)*(g+c.pointLabelFontSize);b.textAlign=e*d==Math.PI||0==e*d?"center":e*d>Math.PI?"right":"left";b.textBaseline="middle";b.fillText(a.labels[d],f,-h)}b.restore()},function(d){var e=2*Math.PI/a.datasets[0].data.length;b.save();b.translate(q/2,u/2);for(var g=0;g<a.datasets.length;g++){b.beginPath();
b.moveTo(0,d*-1*v(a.datasets[g].data[0],j,k));for(var f=1;f<a.datasets[g].data.length;f++)b.rotate(e),b.lineTo(0,d*-1*v(a.datasets[g].data[f],j,k));b.closePath();b.fillStyle=a.datasets[g].fillColor;b.strokeStyle=a.datasets[g].strokeColor;b.lineWidth=c.datasetStrokeWidth;b.fill();b.stroke();if(c.pointDot){b.fillStyle=a.datasets[g].pointColor;b.strokeStyle=a.datasets[g].pointStrokeColor;b.lineWidth=c.pointDotStrokeWidth;for(f=0;f<a.datasets[g].data.length;f++)b.rotate(e),b.beginPath(),b.arc(0,d*-1*
v(a.datasets[g].data[f],j,k),c.pointDotRadius,2*Math.PI,!1),b.fill(),b.stroke()}b.rotate(e)}b.restore()},b)},I=function(a,c,b){for(var e=0,h=Math.min.apply(Math,[u/2,q/2])-5,f=0;f<a.length;f++)e+=a[f].value;x(c,null,function(d){var g=-Math.PI/2,f=1,j=1;c.animation&&(c.animateScale&&(f=d),c.animateRotate&&(j=d));for(d=0;d<a.length;d++){var l=j*a[d].value/e*2*Math.PI;b.beginPath();b.arc(q/2,u/2,f*h,g,g+l);b.lineTo(q/2,u/2);b.closePath();b.fillStyle=a[d].color;b.fill();c.segmentShowStroke&&(b.lineWidth=
c.segmentStrokeWidth,b.strokeStyle=c.segmentStrokeColor,b.stroke());g+=l}},b)},J=function(a,c,b){for(var e=0,h=Math.min.apply(Math,[u/2,q/2])-5,f=h*(c.percentageInnerCutout/100),d=0;d<a.length;d++)e+=a[d].value;x(c,null,function(d){var k=-Math.PI/2,j=1,l=1;c.animation&&(c.animateScale&&(j=d),c.animateRotate&&(l=d));for(d=0;d<a.length;d++){var m=l*a[d].value/e*2*Math.PI;b.beginPath();b.arc(q/2,u/2,j*h,k,k+m,!1);b.arc(q/2,u/2,j*f,k+m,k,!0);b.closePath();b.fillStyle=a[d].color;b.fill();c.segmentShowStroke&&
(b.lineWidth=c.segmentStrokeWidth,b.strokeStyle=c.segmentStrokeColor,b.stroke());k+=m}},b)},K=function(a,c,b){var e,h,f,d,g,k,j,l,m,t,r,n,p,s=0;g=u;b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;t=1;for(d=0;d<a.labels.length;d++)e=b.measureText(a.labels[d]).width,t=e>t?e:t;q/a.labels.length<t?(s=45,q/a.labels.length<Math.cos(s)*t?(s=90,g-=t):g-=Math.sin(s)*t):g-=c.scaleFontSize;d=c.scaleFontSize;g=g-5-d;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(l=
0;l<a.datasets[f].data.length;l++)a.datasets[f].data[l]>e&&(e=a.datasets[f].data[l]),a.datasets[f].data[l]<h&&(h=a.datasets[f].data[l]);f=Math.floor(g/(0.66*d));d=Math.floor(0.5*(g/d));l=c.scaleShowLabels?c.scaleLabel:"";c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(l,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(g,f,d,e,h,l);k=Math.floor(g/j.steps);d=1;if(c.scaleShowLabels){b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;
for(e=0;e<j.labels.length;e++)h=b.measureText(j.labels[e]).width,d=h>d?h:d;d+=10}r=q-d-t;m=Math.floor(r/(a.labels.length-1));n=q-t/2-r;p=g+c.scaleFontSize/2;x(c,function(){b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(q-t/2+5,p);b.lineTo(q-t/2-r-5,p);b.stroke();0<s?(b.save(),b.textAlign="right"):b.textAlign="center";b.fillStyle=c.scaleFontColor;for(var d=0;d<a.labels.length;d++)b.save(),0<s?(b.translate(n+d*m,p+c.scaleFontSize),b.rotate(-(s*(Math.PI/180))),b.fillText(a.labels[d],
0,0),b.restore()):b.fillText(a.labels[d],n+d*m,p+c.scaleFontSize+3),b.beginPath(),b.moveTo(n+d*m,p+3),c.scaleShowGridLines&&0<d?(b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+d*m,5)):b.lineTo(n+d*m,p+3),b.stroke();b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(n,p+5);b.lineTo(n,5);b.stroke();b.textAlign="right";b.textBaseline="middle";for(d=0;d<j.steps;d++)b.beginPath(),b.moveTo(n-3,p-(d+1)*k),c.scaleShowGridLines?(b.lineWidth=c.scaleGridLineWidth,
b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+r+5,p-(d+1)*k)):b.lineTo(n-0.5,p-(d+1)*k),b.stroke(),c.scaleShowLabels&&b.fillText(j.labels[d],n-8,p-(d+1)*k)},function(d){function e(b,c){return p-d*v(a.datasets[b].data[c],j,k)}for(var f=0;f<a.datasets.length;f++){b.strokeStyle=a.datasets[f].strokeColor;b.lineWidth=c.datasetStrokeWidth;b.beginPath();b.moveTo(n,p-d*v(a.datasets[f].data[0],j,k));for(var g=1;g<a.datasets[f].data.length;g++)c.bezierCurve?b.bezierCurveTo(n+m*(g-0.5),e(f,g-1),n+m*(g-0.5),
e(f,g),n+m*g,e(f,g)):b.lineTo(n+m*g,e(f,g));b.stroke();c.datasetFill?(b.lineTo(n+m*(a.datasets[f].data.length-1),p),b.lineTo(n,p),b.closePath(),b.fillStyle=a.datasets[f].fillColor,b.fill()):b.closePath();if(c.pointDot){b.fillStyle=a.datasets[f].pointColor;b.strokeStyle=a.datasets[f].pointStrokeColor;b.lineWidth=c.pointDotStrokeWidth;for(g=0;g<a.datasets[f].data.length;g++)b.beginPath(),b.arc(n+m*g,p-d*v(a.datasets[f].data[g],j,k),c.pointDotRadius,0,2*Math.PI,!0),b.fill(),b.stroke()}}},b)},L=function(a,
c,b){var e,h,f,d,g,k,j,l,m,t,r,n,p,s,w=0;g=u;b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;t=1;for(d=0;d<a.labels.length;d++)e=b.measureText(a.labels[d]).width,t=e>t?e:t;q/a.labels.length<t?(w=45,q/a.labels.length<Math.cos(w)*t?(w=90,g-=t):g-=Math.sin(w)*t):g-=c.scaleFontSize;d=c.scaleFontSize;g=g-5-d;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(l=0;l<a.datasets[f].data.length;l++)a.datasets[f].data[l]>e&&(e=a.datasets[f].data[l]),a.datasets[f].data[l]<
h&&(h=a.datasets[f].data[l]);f=Math.floor(g/(0.66*d));d=Math.floor(0.5*(g/d));l=c.scaleShowLabels?c.scaleLabel:"";c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(l,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(g,f,d,e,h,l);k=Math.floor(g/j.steps);d=1;if(c.scaleShowLabels){b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;for(e=0;e<j.labels.length;e++)h=b.measureText(j.labels[e]).width,d=h>d?h:d;d+=10}r=q-d-t;m=
Math.floor(r/a.labels.length);s=(m-2*c.scaleGridLineWidth-2*c.barValueSpacing-(c.barDatasetSpacing*a.datasets.length-1)-(c.barStrokeWidth/2*a.datasets.length-1))/a.datasets.length;n=q-t/2-r;p=g+c.scaleFontSize/2;x(c,function(){b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(q-t/2+5,p);b.lineTo(q-t/2-r-5,p);b.stroke();0<w?(b.save(),b.textAlign="right"):b.textAlign="center";b.fillStyle=c.scaleFontColor;for(var d=0;d<a.labels.length;d++)b.save(),0<w?(b.translate(n+
d*m,p+c.scaleFontSize),b.rotate(-(w*(Math.PI/180))),b.fillText(a.labels[d],0,0),b.restore()):b.fillText(a.labels[d],n+d*m+m/2,p+c.scaleFontSize+3),b.beginPath(),b.moveTo(n+(d+1)*m,p+3),b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+(d+1)*m,5),b.stroke();b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(n,p+5);b.lineTo(n,5);b.stroke();b.textAlign="right";b.textBaseline="middle";for(d=0;d<j.steps;d++)b.beginPath(),b.moveTo(n-3,p-(d+1)*
k),c.scaleShowGridLines?(b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+r+5,p-(d+1)*k)):b.lineTo(n-0.5,p-(d+1)*k),b.stroke(),c.scaleShowLabels&&b.fillText(j.labels[d],n-8,p-(d+1)*k)},function(d){b.lineWidth=c.barStrokeWidth;for(var e=0;e<a.datasets.length;e++){b.fillStyle=a.datasets[e].fillColor;b.strokeStyle=a.datasets[e].strokeColor;for(var f=0;f<a.datasets[e].data.length;f++){var g=n+c.barValueSpacing+m*f+s*e+c.barDatasetSpacing*e+c.barStrokeWidth*e;b.beginPath();
b.moveTo(g,p);b.lineTo(g,p-d*v(a.datasets[e].data[f],j,k)+c.barStrokeWidth/2);b.lineTo(g+s,p-d*v(a.datasets[e].data[f],j,k)+c.barStrokeWidth/2);b.lineTo(g+s,p);c.barShowStroke&&b.stroke();b.closePath();b.fill()}}},b)},D=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)},F={}};
/*!
 * Add to Homescreen v2.0.7 ~ Copyright (c) 2013 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
var addToHome = (function (w) {
	var nav = w.navigator,
		isIDevice = 'platform' in nav && (/iphone|ipod|ipad/gi).test(nav.platform),
		isIPad,
		isRetina,
		isSafari,
		isStandalone,
		OSVersion,
		startX = 0,
		startY = 0,
		lastVisit = 0,
		isExpired,
		isSessionActive,
		isReturningVisitor,
		balloon,
		overrideChecks,

		positionInterval,
		closeTimeout,

		options = {
			autostart: true,			// Automatically open the balloon
			returningVisitor: false,	// Show the balloon to returning visitors only (setting this to true is HIGHLY RECCOMENDED)
			animationIn: 'drop',		// drop || bubble || fade
			animationOut: 'fade',		// drop || bubble || fade
			startDelay: 2000,			// 2 seconds from page load before the balloon appears
			lifespan: 15000,			// 15 seconds before it is automatically destroyed
			bottomOffset: 14,			// Distance of the balloon from bottom
			expire: 0,					// Minutes to wait before showing the popup again (0 = always displayed)
			message: '',				// Customize your message or force a language ('' = automatic)
			touchIcon: false,			// Display the touch icon
			arrow: true,				// Display the balloon arrow
			hookOnLoad: true,			// Should we hook to onload event? (really advanced usage)
			closeButton: true,			// Let the user close the balloon
			iterations: 100				// Internal/debug use
		},

		intl = {
			ar:    '<span dir="rtl">قم بتثبيت هذا التطبيق على <span dir="ltr">%device:</span>انقر<span dir="ltr">%icon</span> ،<strong>ثم اضفه الى الشاشة الرئيسية.</strong></span>',
			ca_es: 'Per instal·lar aquesta aplicació al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d\'inici</strong>.',
			cs_cz: 'Pro instalaci aplikace na Váš %device, stiskněte %icon a v nabídce <strong>Přidat na plochu</strong>.',
			da_dk: 'Tilføj denne side til din %device: tryk på %icon og derefter <strong>Føj til hjemmeskærm</strong>.',
			de_de: 'Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.',
			el_gr: 'Εγκαταστήσετε αυτήν την Εφαρμογή στήν συσκευή σας %device: %icon μετά πατάτε <strong>Προσθήκη σε Αφετηρία</strong>.',
			en_us: 'Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.',
			es_es: 'Para instalar esta app en su %device, pulse %icon y seleccione <strong>Añadir a pantalla de inicio</strong>.',
			fi_fi: 'Asenna tämä web-sovellus laitteeseesi %device: paina %icon ja sen jälkeen valitse <strong>Lisää Koti-valikkoon</strong>.',
			fr_fr: 'Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter à l\'écran d\'accueil</strong>.',
			he_il: '<span dir="rtl">התקן אפליקציה זו על ה-%device שלך: הקש %icon ואז <strong>הוסף למסך הבית</strong>.</span>',
			hr_hr: 'Instaliraj ovu aplikaciju na svoj %device: klikni na %icon i odaberi <strong>Dodaj u početni zaslon</strong>.',
			hu_hu: 'Telepítse ezt a web-alkalmazást az Ön %device-jára: nyomjon a %icon-ra majd a <strong>Főképernyőhöz adás</strong> gombra.',
			it_it: 'Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.',
			ja_jp: 'このウェブアプリをあなたの%deviceにインストールするには%iconをタップして<strong>ホーム画面に追加</strong>を選んでください。',
			ko_kr: '%device에 웹앱을 설치하려면 %icon을 터치 후 "홈화면에 추가"를 선택하세요',
			nb_no: 'Installer denne appen på din %device: trykk på %icon og deretter <strong>Legg til på Hjem-skjerm</strong>',
			nl_nl: 'Installeer deze webapp op uw %device: tik %icon en dan <strong>Voeg toe aan beginscherm</strong>.',
			pl_pl: 'Aby zainstalować tę aplikacje na %device: naciśnij %icon a następnie <strong>Dodaj jako ikonę</strong>.',
			pt_br: 'Instale este aplicativo em seu %device: aperte %icon e selecione <strong>Adicionar à Tela Inicio</strong>.',
			pt_pt: 'Para instalar esta aplicação no seu %device, prima o %icon e depois o <strong>Adicionar ao ecrã principal</strong>.',
			ru_ru: 'Установите это веб-приложение на ваш %device: нажмите %icon, затем <strong>Добавить в «Домой»</strong>.',
			sv_se: 'Lägg till denna webbapplikation på din %device: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>.',
			th_th: 'ติดตั้งเว็บแอพฯ นี้บน %device ของคุณ: แตะ %icon และ <strong>เพิ่มที่หน้าจอโฮม</strong>',
			tr_tr: 'Bu uygulamayı %device\'a eklemek için %icon simgesine sonrasında <strong>Ana Ekrana Ekle</strong> düğmesine basın.',
			uk_ua: 'Встановіть цей веб сайт на Ваш %device: натисніть %icon, а потім <strong>На початковий екран</strong>.',
			zh_cn: '您可以将此应用程式安装到您的 %device 上。请按 %icon 然后点选<strong>添加至主屏幕</strong>。',
			zh_tw: '您可以將此應用程式安裝到您的 %device 上。請按 %icon 然後點選<strong>加入主畫面螢幕</strong>。'
		};

	function init () {
		// Preliminary check, all further checks are performed on iDevices only
		if ( !isIDevice ) return;

		var now = Date.now(),
			i;

		// Merge local with global options
		if ( w.addToHomeConfig ) {
			for ( i in w.addToHomeConfig ) {
				options[i] = w.addToHomeConfig[i];
			}
		}
		if ( !options.autostart ) options.hookOnLoad = false;

		isIPad = (/ipad/gi).test(nav.platform);
		isRetina = w.devicePixelRatio && w.devicePixelRatio > 1;
		isSafari = (/Safari/i).test(nav.appVersion) && !(/CriOS/i).test(nav.appVersion);
		isStandalone = nav.standalone;
		OSVersion = nav.appVersion.match(/OS (\d+_\d+)/i);
		OSVersion = OSVersion && OSVersion[1] ? +OSVersion[1].replace('_', '.') : 0;

		lastVisit = +w.localStorage.getItem('addToHome');

		isSessionActive = w.sessionStorage.getItem('addToHomeSession');
		isReturningVisitor = options.returningVisitor ? lastVisit && lastVisit + 28*24*60*60*1000 > now : true;

		if ( !lastVisit ) lastVisit = now;

		// If it is expired we need to reissue a new balloon
		isExpired = isReturningVisitor && lastVisit <= now;

		if ( options.hookOnLoad ) w.addEventListener('load', loaded, false);
		else if ( !options.hookOnLoad && options.autostart ) loaded();
	}

	function loaded () {
		w.removeEventListener('load', loaded, false);

		if ( !isReturningVisitor ) w.localStorage.setItem('addToHome', Date.now());
		else if ( options.expire && isExpired ) w.localStorage.setItem('addToHome', Date.now() + options.expire * 60000);

		if ( !overrideChecks && ( !isSafari || !isExpired || isSessionActive || isStandalone || !isReturningVisitor ) ) return;

		var touchIcon = '',
			platform = nav.platform.split(' ')[0],
			language = nav.language.replace('-', '_');

		balloon = document.createElement('div');
		balloon.id = 'addToHomeScreen';
		balloon.style.cssText += 'left:-9999px;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);position:' + (OSVersion < 5 ? 'absolute' : 'fixed');

		// Localize message
		if ( options.message in intl ) {		// You may force a language despite the user's locale
			language = options.message;
			options.message = '';
		}
		if ( options.message === '' ) {			// We look for a suitable language (defaulted to en_us)
			options.message = language in intl ? intl[language] : intl['en_us'];
		}

		if ( options.touchIcon ) {
			touchIcon = isRetina ?
				document.querySelector('head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon]') :
				document.querySelector('head link[rel^=apple-touch-icon][sizes="57x57"],head link[rel^=apple-touch-icon]');

			if ( touchIcon ) {
				touchIcon = '<span style="background-image:url(' + touchIcon.href + ')" class="addToHomeTouchIcon"></span>';
			}
		}

		balloon.className = (isIPad ? 'addToHomeIpad' : 'addToHomeIphone') + (touchIcon ? ' addToHomeWide' : '');
		balloon.innerHTML = touchIcon +
			options.message.replace('%device', platform).replace('%icon', OSVersion >= 4.2 ? '<span class="addToHomeShare"></span>' : '<span class="addToHomePlus">+</span>') +
			(options.arrow ? '<span class="addToHomeArrow"></span>' : '') +
			(options.closeButton ? '<span class="addToHomeClose">\u00D7</span>' : '');

		document.body.appendChild(balloon);

		// Add the close action
		if ( options.closeButton ) balloon.addEventListener('click', clicked, false);

		if ( !isIPad && OSVersion >= 6 ) window.addEventListener('orientationchange', orientationCheck, false);

		setTimeout(show, options.startDelay);
	}

	function show () {
		var duration,
			iPadXShift = 208;

		// Set the initial position
		if ( isIPad ) {
			if ( OSVersion < 5 ) {
				startY = w.scrollY;
				startX = w.scrollX;
			} else if ( OSVersion < 6 ) {
				iPadXShift = 160;
			}

			balloon.style.top = startY + options.bottomOffset + 'px';
			balloon.style.left = startX + iPadXShift - Math.round(balloon.offsetWidth / 2) + 'px';

			switch ( options.animationIn ) {
				case 'drop':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(w.scrollY + options.bottomOffset + balloon.offsetHeight) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.opacity = '0';
					balloon.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		} else {
			startY = w.innerHeight + w.scrollY;

			if ( OSVersion < 5 ) {
				startX = Math.round((w.innerWidth - balloon.offsetWidth) / 2) + w.scrollX;
				balloon.style.left = startX + 'px';
				balloon.style.top = startY - balloon.offsetHeight - options.bottomOffset + 'px';
			} else {
				balloon.style.left = '50%';
				balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - ( w.orientation%180 && OSVersion >= 6 ? 40 : 0 ) + 'px';
				balloon.style.bottom = options.bottomOffset + 'px';
			}

			switch (options.animationIn) {
				case 'drop':
					duration = '1s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + (balloon.offsetHeight + options.bottomOffset + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		}

		balloon.offsetHeight;	// repaint trick
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.opacity = '1';
		balloon.style.webkitTransform = 'translate3d(0,0,0)';
		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);

		closeTimeout = setTimeout(close, options.lifespan);
	}

	function manualShow (override) {
		if ( !isIDevice || balloon ) return;

		overrideChecks = override;
		loaded();
	}

	function close () {
		clearInterval( positionInterval );
		clearTimeout( closeTimeout );
		closeTimeout = null;

		// check if the popup is displayed and prevent errors
		if ( !balloon ) return;

		var posY = 0,
			posX = 0,
			opacity = '1',
			duration = '0';

		if ( options.closeButton ) balloon.removeEventListener('click', clicked, false);
		if ( !isIPad && OSVersion >= 6 ) window.removeEventListener('orientationchange', orientationCheck, false);

		if ( OSVersion < 5 ) {
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY;
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth)/2) - startX;
		}

		balloon.style.webkitTransitionProperty = '-webkit-transform,opacity';

		switch ( options.animationOut ) {
			case 'drop':
				if ( isIPad ) {
					duration = '0.4s';
					opacity = '0';
					posY += 50;
				} else {
					duration = '0.6s';
					posY += balloon.offsetHeight + options.bottomOffset + 50;
				}
				break;
			case 'bubble':
				if ( isIPad ) {
					duration = '0.8s';
					posY -= balloon.offsetHeight + options.bottomOffset + 50;
				} else {
					duration = '0.4s';
					opacity = '0';
					posY -= 50;
				}
				break;
			default:
				duration = '0.8s';
				opacity = '0';
		}

		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);
		balloon.style.opacity = opacity;
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}


	function clicked () {
		w.sessionStorage.setItem('addToHomeSession', '1');
		isSessionActive = true;
		close();
	}

	function transitionEnd () {
		balloon.removeEventListener('webkitTransitionEnd', transitionEnd, false);

		balloon.style.webkitTransitionProperty = '-webkit-transform';
		balloon.style.webkitTransitionDuration = '0.2s';

		// We reached the end!
		if ( !closeTimeout ) {
			balloon.parentNode.removeChild(balloon);
			balloon = null;
			return;
		}

		// On iOS 4 we start checking the element position
		if ( OSVersion < 5 && closeTimeout ) positionInterval = setInterval(setPosition, options.iterations);
	}

	function setPosition () {
		var matrix = new WebKitCSSMatrix(w.getComputedStyle(balloon, null).webkitTransform),
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY,
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth) / 2) - startX;

		// Screen didn't move
		if ( posY == matrix.m42 && posX == matrix.m41 ) return;

		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}

	// Clear local and session storages (this is useful primarily in development)
	function reset () {
		w.localStorage.removeItem('addToHome');
		w.sessionStorage.removeItem('addToHomeSession');
	}

	function orientationCheck () {
		balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) - ( w.orientation%180 && OSVersion >= 6 ? 40 : 0 ) + 'px';
	}

	// Bootstrap!
	init();

	return {
		show: manualShow,
		close: close,
		reset: reset
	};
})(window);

var angles = angular.module("angles", []);


angles.chart = function (type) {
	return { 
		restrict: "A",
		scope: {
			data: "=",
			options: "=",
			id: "@"
		},
		link: function ($scope, $elem) {
			var ctx = $elem[0].getContext("2d");
			var chart = new Chart(ctx);
			
			$scope.$watch("data", function (newVal, oldVal) { 
				// if data not defined, exit
				if (!newVal) return;
				
				chart[type]($scope.data, $scope.options);
			}, true);
		}
	}
}


/* General Chart Wrapper */
angles.directive("chart", function () { 
	return { 
		restrict: "A",
		scope: {
			data: "=",
			type: "@",
			options: "=",
			id: "@"
		},
		link: function ($scope, $elem) {
			var ctx = $elem[0].getContext("2d");
			var chart = new Chart(ctx);
			
			$scope.$watch("data", function (newVal, oldVal) { 
				chart[$scope.type]($scope.data, $scope.options);
			}, true);
		}
	} 
});


/* Aliases for various chart types */
angles.directive("linechart", function () { return angles.chart("Line"); });
angles.directive("barchart", function () { return angles.chart("Bar"); });
angles.directive("radarchart", function () { return angles.chart("Radar"); });
angles.directive("polarchart", function () { return angles.chart("PolarArea"); });
angles.directive("piechart", function () { return angles.chart("Pie"); });
angles.directive("donutchart", function () { return angles.chart("Doughnut"); });

/**
 * angular-growl - v0.3.1 - 2013-10-01
 * https://github.com/marcorinck/angular-growl
 * Copyright (c) 2013 Marco Rinck; Licensed MIT
 */
angular.module("angular-growl",[]),angular.module("angular-growl").directive("growl",["$rootScope",function(a){"use strict";return{restrict:"A",template:'<div class="growl">	<div class="growl-item alert" ng-repeat="message in messages" ng-class="computeClasses(message)">		<button type="button" class="close" ng-click="deleteMessage(message)">&times;</button>            {{ message.text}}	</div></div>',replace:!1,scope:!0,controller:["$scope","$timeout",function(b,c){b.messages=[],a.$on("growlMessage",function(a,d){b.messages.push(d),d.ttl&&-1!==d.ttl&&c(function(){b.deleteMessage(d)},d.ttl)}),b.deleteMessage=function(a){var c=b.messages.indexOf(a);c>-1&&b.messages.splice(c,1)},b.computeClasses=function(a){return{"alert-success":a.isSuccess,"alert-error":a.isError,"alert-danger":a.isError,"alert-info":a.isInfo,"alert-warning":a.isWarn}}}]}}]),angular.module("angular-growl").provider("growl",function(){"use strict";var a=null,b="messages",c="text",d="severity";this.globalTimeToLive=function(b){a=b},this.messagesKey=function(a){b=a},this.messageTextKey=function(a){c=a},this.messageSeverityKey=function(a){d=a},this.serverMessagesInterceptor=["$q","growl",function(a,c){function d(a){a.data[b]&&a.data[b].length>0&&c.addServerMessages(a.data[b])}function e(a){return d(a),a}function f(b){return d(b),a.reject(b)}return function(a){return a.then(e,f)}}],this.$get=["$rootScope","$filter",function(b,e){function f(a){m&&(a.text=m(a.text)),b.$broadcast("growlMessage",a)}function g(b,c,d){var e,g=c||{};e={text:b,isWarn:d.isWarn,isError:d.isError,isInfo:d.isInfo,isSuccess:d.isSuccess,ttl:g.ttl||a},f(e)}function h(a,b){g(a,b,{isWarn:!0})}function i(a,b){g(a,b,{isError:!0})}function j(a,b){g(a,b,{isInfo:!0})}function k(a,b){g(a,b,{isSuccess:!0})}function l(a){var b,e,f,h;for(h=a.length,b=0;h>b;b++)if(e=a[b],e[c]&&e[d]){switch(e[d]){case"warn":f={isWarn:!0};break;case"success":f={isSuccess:!0};break;case"info":f={isInfo:!0};break;case"error":f={isError:!0}}g(e[c],void 0,f)}}var m;try{m=e("translate")}catch(n){}return{addWarnMessage:h,addErrorMessage:i,addInfoMessage:j,addSuccessMessage:k,addServerMessages:l}}]});
// moment.js
// version : 2.0.0
// author : Tim Wood
// license : MIT
// momentjs.com
(function(e){function O(e,t){return function(n){return j(e.call(this,n),t)}}function M(e){return function(t){return this.lang().ordinal(e.call(this,t))}}function _(){}function D(e){H(this,e)}function P(e){var t=this._data={},n=e.years||e.year||e.y||0,r=e.months||e.month||e.M||0,i=e.weeks||e.week||e.w||0,s=e.days||e.day||e.d||0,o=e.hours||e.hour||e.h||0,u=e.minutes||e.minute||e.m||0,a=e.seconds||e.second||e.s||0,f=e.milliseconds||e.millisecond||e.ms||0;this._milliseconds=f+a*1e3+u*6e4+o*36e5,this._days=s+i*7,this._months=r+n*12,t.milliseconds=f%1e3,a+=B(f/1e3),t.seconds=a%60,u+=B(a/60),t.minutes=u%60,o+=B(u/60),t.hours=o%24,s+=B(o/24),s+=i*7,t.days=s%30,r+=B(s/30),t.months=r%12,n+=B(r/12),t.years=n}function H(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function B(e){return e<0?Math.ceil(e):Math.floor(e)}function j(e,t){var n=e+"";while(n.length<t)n="0"+n;return n}function F(e,t,n){var r=t._milliseconds,i=t._days,s=t._months,o;r&&e._d.setTime(+e+r*n),i&&e.date(e.date()+i*n),s&&(o=e.date(),e.date(1).month(e.month()+s*n).date(Math.min(o,e.daysInMonth())))}function I(e){return Object.prototype.toString.call(e)==="[object Array]"}function q(e,t){var n=Math.min(e.length,t.length),r=Math.abs(e.length-t.length),i=0,s;for(s=0;s<n;s++)~~e[s]!==~~t[s]&&i++;return i+r}function R(e,t){return t.abbr=e,s[e]||(s[e]=new _),s[e].set(t),s[e]}function U(e){return e?(!s[e]&&o&&require("./lang/"+e),s[e]):t.fn._lang}function z(e){return e.match(/\[.*\]/)?e.replace(/^\[|\]$/g,""):e.replace(/\\/g,"")}function W(e){var t=e.match(a),n,r;for(n=0,r=t.length;n<r;n++)A[t[n]]?t[n]=A[t[n]]:t[n]=z(t[n]);return function(i){var s="";for(n=0;n<r;n++)s+=typeof t[n].call=="function"?t[n].call(i,e):t[n];return s}}function X(e,t){function r(t){return e.lang().longDateFormat(t)||t}var n=5;while(n--&&f.test(t))t=t.replace(f,r);return C[t]||(C[t]=W(t)),C[t](e)}function V(e){switch(e){case"DDDD":return p;case"YYYY":return d;case"YYYYY":return v;case"S":case"SS":case"SSS":case"DDD":return h;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":case"a":case"A":return m;case"X":return b;case"Z":case"ZZ":return g;case"T":return y;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return c;default:return new RegExp(e.replace("\\",""))}}function $(e,t,n){var r,i,s=n._a;switch(e){case"M":case"MM":s[1]=t==null?0:~~t-1;break;case"MMM":case"MMMM":r=U(n._l).monthsParse(t),r!=null?s[1]=r:n._isValid=!1;break;case"D":case"DD":case"DDD":case"DDDD":t!=null&&(s[2]=~~t);break;case"YY":s[0]=~~t+(~~t>68?1900:2e3);break;case"YYYY":case"YYYYY":s[0]=~~t;break;case"a":case"A":n._isPm=(t+"").toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":s[3]=~~t;break;case"m":case"mm":s[4]=~~t;break;case"s":case"ss":s[5]=~~t;break;case"S":case"SS":case"SSS":s[6]=~~(("0."+t)*1e3);break;case"X":n._d=new Date(parseFloat(t)*1e3);break;case"Z":case"ZZ":n._useUTC=!0,r=(t+"").match(x),r&&r[1]&&(n._tzh=~~r[1]),r&&r[2]&&(n._tzm=~~r[2]),r&&r[0]==="+"&&(n._tzh=-n._tzh,n._tzm=-n._tzm)}t==null&&(n._isValid=!1)}function J(e){var t,n,r=[];if(e._d)return;for(t=0;t<7;t++)e._a[t]=r[t]=e._a[t]==null?t===2?1:0:e._a[t];r[3]+=e._tzh||0,r[4]+=e._tzm||0,n=new Date(0),e._useUTC?(n.setUTCFullYear(r[0],r[1],r[2]),n.setUTCHours(r[3],r[4],r[5],r[6])):(n.setFullYear(r[0],r[1],r[2]),n.setHours(r[3],r[4],r[5],r[6])),e._d=n}function K(e){var t=e._f.match(a),n=e._i,r,i;e._a=[];for(r=0;r<t.length;r++)i=(V(t[r]).exec(n)||[])[0],i&&(n=n.slice(n.indexOf(i)+i.length)),A[t[r]]&&$(t[r],i,e);e._isPm&&e._a[3]<12&&(e._a[3]+=12),e._isPm===!1&&e._a[3]===12&&(e._a[3]=0),J(e)}function Q(e){var t,n,r,i=99,s,o,u;while(e._f.length){t=H({},e),t._f=e._f.pop(),K(t),n=new D(t);if(n.isValid()){r=n;break}u=q(t._a,n.toArray()),u<i&&(i=u,r=n)}H(e,r)}function G(e){var t,n=e._i;if(w.exec(n)){e._f="YYYY-MM-DDT";for(t=0;t<4;t++)if(S[t][1].exec(n)){e._f+=S[t][0];break}g.exec(n)&&(e._f+=" Z"),K(e)}else e._d=new Date(n)}function Y(t){var n=t._i,r=u.exec(n);n===e?t._d=new Date:r?t._d=new Date(+r[1]):typeof n=="string"?G(t):I(n)?(t._a=n.slice(0),J(t)):t._d=n instanceof Date?new Date(+n):new Date(n)}function Z(e,t,n,r,i){return i.relativeTime(t||1,!!n,e,r)}function et(e,t,n){var i=r(Math.abs(e)/1e3),s=r(i/60),o=r(s/60),u=r(o/24),a=r(u/365),f=i<45&&["s",i]||s===1&&["m"]||s<45&&["mm",s]||o===1&&["h"]||o<22&&["hh",o]||u===1&&["d"]||u<=25&&["dd",u]||u<=45&&["M"]||u<345&&["MM",r(u/30)]||a===1&&["y"]||["yy",a];return f[2]=t,f[3]=e>0,f[4]=n,Z.apply({},f)}function tt(e,n,r){var i=r-n,s=r-e.day();return s>i&&(s-=7),s<i-7&&(s+=7),Math.ceil(t(e).add("d",s).dayOfYear()/7)}function nt(e){var n=e._i,r=e._f;return n===null||n===""?null:(typeof n=="string"&&(e._i=n=U().preparse(n)),t.isMoment(n)?(e=H({},n),e._d=new Date(+n._d)):r?I(r)?Q(e):K(e):Y(e),new D(e))}function rt(e,n){t.fn[e]=t.fn[e+"s"]=function(e){var t=this._isUTC?"UTC":"";return e!=null?(this._d["set"+t+n](e),this):this._d["get"+t+n]()}}function it(e){t.duration.fn[e]=function(){return this._data[e]}}function st(e,n){t.duration.fn["as"+e]=function(){return+this/n}}var t,n="2.0.0",r=Math.round,i,s={},o=typeof module!="undefined"&&module.exports,u=/^\/?Date\((\-?\d+)/i,a=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,f=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,l=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,c=/\d\d?/,h=/\d{1,3}/,p=/\d{3}/,d=/\d{1,4}/,v=/[+\-]?\d{1,6}/,m=/[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i,g=/Z|[\+\-]\d\d:?\d\d/i,y=/T/i,b=/[\+\-]?\d+(\.\d{1,3})?/,w=/^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,E="YYYY-MM-DDTHH:mm:ssZ",S=[["HH:mm:ss.S",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],x=/([\+\-]|\d\d)/gi,T="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),N={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},C={},k="DDD w W M D d".split(" "),L="M D H h m s w W".split(" "),A={M:function(){return this.month()+1},MMM:function(e){return this.lang().monthsShort(this,e)},MMMM:function(e){return this.lang().months(this,e)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(e){return this.lang().weekdaysMin(this,e)},ddd:function(e){return this.lang().weekdaysShort(this,e)},dddd:function(e){return this.lang().weekdays(this,e)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return j(this.year()%100,2)},YYYY:function(){return j(this.year(),4)},YYYYY:function(){return j(this.year(),5)},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return~~(this.milliseconds()/100)},SS:function(){return j(~~(this.milliseconds()/10),2)},SSS:function(){return j(this.milliseconds(),3)},Z:function(){var e=-this.zone(),t="+";return e<0&&(e=-e,t="-"),t+j(~~(e/60),2)+":"+j(~~e%60,2)},ZZ:function(){var e=-this.zone(),t="+";return e<0&&(e=-e,t="-"),t+j(~~(10*e/6),4)},X:function(){return this.unix()}};while(k.length)i=k.pop(),A[i+"o"]=M(A[i]);while(L.length)i=L.pop(),A[i+i]=O(A[i],2);A.DDDD=O(A.DDD,3),_.prototype={set:function(e){var t,n;for(n in e)t=e[n],typeof t=="function"?this[n]=t:this["_"+n]=t},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(e){return this._months[e.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(e){return this._monthsShort[e.month()]},monthsParse:function(e){var n,r,i,s;this._monthsParse||(this._monthsParse=[]);for(n=0;n<12;n++){this._monthsParse[n]||(r=t([2e3,n]),i="^"+this.months(r,"")+"|^"+this.monthsShort(r,""),this._monthsParse[n]=new RegExp(i.replace(".",""),"i"));if(this._monthsParse[n].test(e))return n}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(e){return this._weekdays[e.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(e){return this._weekdaysShort[e.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(e){return this._weekdaysMin[e.day()]},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(e){var t=this._longDateFormat[e];return!t&&this._longDateFormat[e.toUpperCase()]&&(t=this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(e){return e.slice(1)}),this._longDateFormat[e]=t),t},meridiem:function(e,t,n){return e>11?n?"pm":"PM":n?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},calendar:function(e,t){var n=this._calendar[e];return typeof n=="function"?n.apply(t):n},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(e,t,n,r){var i=this._relativeTime[n];return typeof i=="function"?i(e,t,n,r):i.replace(/%d/i,e)},pastFuture:function(e,t){var n=this._relativeTime[e>0?"future":"past"];return typeof n=="function"?n(t):n.replace(/%s/i,t)},ordinal:function(e){return this._ordinal.replace("%d",e)},_ordinal:"%d",preparse:function(e){return e},postformat:function(e){return e},week:function(e){return tt(e,this._week.dow,this._week.doy)},_week:{dow:0,doy:6}},t=function(e,t,n){return nt({_i:e,_f:t,_l:n,_isUTC:!1})},t.utc=function(e,t,n){return nt({_useUTC:!0,_isUTC:!0,_l:n,_i:e,_f:t})},t.unix=function(e){return t(e*1e3)},t.duration=function(e,n){var r=t.isDuration(e),i=typeof e=="number",s=r?e._data:i?{}:e,o;return i&&(n?s[n]=e:s.milliseconds=e),o=new P(s),r&&e.hasOwnProperty("_lang")&&(o._lang=e._lang),o},t.version=n,t.defaultFormat=E,t.lang=function(e,n){var r;if(!e)return t.fn._lang._abbr;n?R(e,n):s[e]||U(e),t.duration.fn._lang=t.fn._lang=U(e)},t.langData=function(e){return e&&e._lang&&e._lang._abbr&&(e=e._lang._abbr),U(e)},t.isMoment=function(e){return e instanceof D},t.isDuration=function(e){return e instanceof P},t.fn=D.prototype={clone:function(){return t(this)},valueOf:function(){return+this._d},unix:function(){return Math.floor(+this._d/1e3)},toString:function(){return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._d},toJSON:function(){return t.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var e=this;return[e.year(),e.month(),e.date(),e.hours(),e.minutes(),e.seconds(),e.milliseconds()]},isValid:function(){return this._isValid==null&&(this._a?this._isValid=!q(this._a,(this._isUTC?t.utc(this._a):t(this._a)).toArray()):this._isValid=!isNaN(this._d.getTime())),!!this._isValid},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(e){var n=X(this,e||t.defaultFormat);return this.lang().postformat(n)},add:function(e,n){var r;return typeof e=="string"?r=t.duration(+n,e):r=t.duration(e,n),F(this,r,1),this},subtract:function(e,n){var r;return typeof e=="string"?r=t.duration(+n,e):r=t.duration(e,n),F(this,r,-1),this},diff:function(e,n,r){var i=this._isUTC?t(e).utc():t(e).local(),s=(this.zone()-i.zone())*6e4,o,u;return n&&(n=n.replace(/s$/,"")),n==="year"||n==="month"?(o=(this.daysInMonth()+i.daysInMonth())*432e5,u=(this.year()-i.year())*12+(this.month()-i.month()),u+=(this-t(this).startOf("month")-(i-t(i).startOf("month")))/o,n==="year"&&(u/=12)):(o=this-i-s,u=n==="second"?o/1e3:n==="minute"?o/6e4:n==="hour"?o/36e5:n==="day"?o/864e5:n==="week"?o/6048e5:o),r?u:B(u)},from:function(e,n){return t.duration(this.diff(e)).lang(this.lang()._abbr).humanize(!n)},fromNow:function(e){return this.from(t(),e)},calendar:function(){var e=this.diff(t().startOf("day"),"days",!0),n=e<-6?"sameElse":e<-1?"lastWeek":e<0?"lastDay":e<1?"sameDay":e<2?"nextDay":e<7?"nextWeek":"sameElse";return this.format(this.lang().calendar(n,this))},isLeapYear:function(){var e=this.year();return e%4===0&&e%100!==0||e%400===0},isDST:function(){return this.zone()<t([this.year()]).zone()||this.zone()<t([this.year(),5]).zone()},day:function(e){var t=this._isUTC?this._d.getUTCDay():this._d.getDay();return e==null?t:this.add({d:e-t})},startOf:function(e){e=e.replace(/s$/,"");switch(e){case"year":this.month(0);case"month":this.date(1);case"week":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return e==="week"&&this.day(0),this},endOf:function(e){return this.startOf(e).add(e.replace(/s?$/,"s"),1).subtract("ms",1)},isAfter:function(e,n){return n=typeof n!="undefined"?n:"millisecond",+this.clone().startOf(n)>+t(e).startOf(n)},isBefore:function(e,n){return n=typeof n!="undefined"?n:"millisecond",+this.clone().startOf(n)<+t(e).startOf(n)},isSame:function(e,n){return n=typeof n!="undefined"?n:"millisecond",+this.clone().startOf(n)===+t(e).startOf(n)},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return t.utc([this.year(),this.month()+1,0]).date()},dayOfYear:function(e){var n=r((t(this).startOf("day")-t(this).startOf("year"))/864e5)+1;return e==null?n:this.add("d",e-n)},isoWeek:function(e){var t=tt(this,1,4);return e==null?t:this.add("d",(e-t)*7)},week:function(e){var t=this.lang().week(this);return e==null?t:this.add("d",(e-t)*7)},lang:function(t){return t===e?this._lang:(this._lang=U(t),this)}};for(i=0;i<T.length;i++)rt(T[i].toLowerCase().replace(/s$/,""),T[i]);rt("year","FullYear"),t.fn.days=t.fn.day,t.fn.weeks=t.fn.week,t.fn.isoWeeks=t.fn.isoWeek,t.duration.fn=P.prototype={weeks:function(){return B(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*864e5+this._months*2592e6},humanize:function(e){var t=+this,n=et(t,!e,this.lang());return e&&(n=this.lang().pastFuture(t,n)),this.lang().postformat(n)},lang:t.fn.lang};for(i in N)N.hasOwnProperty(i)&&(st(i,N[i]),it(i.toLowerCase()));st("Weeks",6048e5),t.lang("en",{ordinal:function(e){var t=e%10,n=~~(e%100/10)===1?"th":t===1?"st":t===2?"nd":t===3?"rd":"th";return e+n}}),o&&(module.exports=t),typeof ender=="undefined"&&(this.moment=t),typeof define=="function"&&define.amd&&define("moment",[],function(){return t})}).call(this);
var GuitarJournalApp = angular.module('GuitarJournalApp', ['ngCookies', 'angles', 'angular-growl']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'home.html', 
        controller: "HomeCtrl"
      }).
      when('/app/', {
        templateUrl: 'home.html', 
        controller: "HomeCtrl"
      }).
      when('/login', {
        templateUrl: 'login.html',
        controller: "LoginCtrl"
      }).
      when('/sessions', {
        templateUrl: 'sessions.html', 
        controller: "SessionsCtrl"
      }).
      when('/session/:id', {
        templateUrl: 'session.html', 
        controller: "SessionCtrl"
      }).
      when('/goals', {
        templateUrl: 'goals.html', 
        controller: "GoalsCtrl"
      }).
      when('/goal/:id', {
        templateUrl: 'goal.html', 
        controller: "GoalCtrl"
      }).
      when('/stats', {
        templateUrl: 'stats.html', 
        controller: "StatsCtrl"
      }).
      when('/profile', {
        templateUrl: 'profile.html', 
        controller: "ProfileCtrl"
      }).
      when('/instrument/:id', {
        templateUrl: 'instrument.html', 
        controller: "InstrumentCtrl"
      });
    $locationProvider.html5Mode(true);
  }])
  .directive('fileChange', function () {
      var linker = function ($scope, element, attributes) {
          // onChange, push the files to $scope.files.
          element.bind('change', function (event) {
              var files = event.target.files;
              $scope.$apply(function () {
                  for (var i = 0, length = files.length; i < length; i++) {
                      $scope.files.push(files[i]);
                  }
              });
          });
      };

      return {
          restrict: 'A',
          link: linker
      };
  })
  .directive('file', function() {
    return {
      scope: { file: '=' },
      link: function(scope, el, attrs) {
          el.bind('change', function(event) {
              var files = event.target.files;
              var file = files[0];
              scope.file = file;
              scope.$apply();
          });
      }
    };
  })
  .filter('take', function() {
    return function(input, numItems) {
      if (!input || !input.length)
        return input;

      return input.filter(function(elem, index) {
        return index < numItems;
      });
    };
  }).filter('suffix', function() {
    return function(input, suffix) {
      if (input)
        return input + suffix;
      else
        return input; 
    };
  });
function AppCtrl($scope, $http, $location, Sessions, $rootScope, growl) {
	console.log($location);
	$scope.pageSettings = {};
	$rootScope.apiStatus = {};
	$rootScope.apiStatus.loading = 0;
	$scope.apiStatus = $rootScope.apiStatus;
	$scope.allowSimpleLogin = false;

	$http.get('auth/allowsimple').success(function(data) {
		if (data == "true")
			$scope.allowSimpleLogin = true;
	});

	$http.get('/api/loggedin').success(function(data) {
		$rootScope.apiStatus.loading++;
		$rootScope.csrf = data._csrf;
		$rootScope.httpConfig = {
			headers: { "X-CSRF-Token": $rootScope.csrf }
		};
		if (data._id) {
			$rootScope.loggedIn = true;
			$rootScope.apiStatus.loading--;
		}
		else {
			$rootScope.apiStatus.loading--;
			$location.path("/login");
		}
	}).error(function(data) { console.log("Couldn't check logged in status"); });

	$rootScope.$watch('loggedIn', function () {
		if ($rootScope.loggedIn) {
			$http.get('/api/profile')
				.success(function(data) {
					$scope.profile = data;
				})
				.error(function(data){
					alert("Error when getting profile.");
				});			
		}
	});

	$scope.Sessions = Sessions;
	$rootScope.sessionsReload = true;

	$scope.$watch('Sessions.sessions', function () {
		if ($rootScope.loggedIn) {
			$rootScope.sessionsReload = true;
			
		}
	}, true);
}

function LoginCtrl($scope, $http, $location, $cookies, $cookieStore, $rootScope) {
	$scope.pageSettings.hideNavigation = true;
	$scope.login = function() {
		console.log("Trying to log in");
		$http.post("/api/login", {email: $scope.email, password: $scope.password}, $rootScope.httpConfig).success(function(data) {
			if (data._id) {
				$rootScope.loggedIn = true;
				$scope.pageSettings.hideNavigation = false;
			}
			$location.path("/");
		}).error(function(data) { console.log("Could not log in"); });
	};
}

function HomeCtrl($scope, $http, $location, $rootScope, Sessions, Goals, Instruments, Statistics) {
	$scope.pageSettings.pageTitle = "OSIRIS GUITAR Journal";
	$scope.pageSettings.active = "home";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
	$scope.pageSettings.hideNavigation = false;
	$scope.Sessions = Sessions;
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.Statistics = Statistics;
	$scope.statsOverview = Statistics.statsOverview;
	Statistics.getStatsOverview();
	Statistics.getWeekStats();

	$scope.$watch("Statistics.statsOverview", function () {
		console.log("statsOverview reloaded!");
		$scope.statsOverview = Statistics.statsOverview;
	});
	$scope.$watch("Statistics.weekStats", function () {
		console.log("weekStats reloaded!");
		$scope.weekStats = Statistics.weekStats;
	});

	$scope.sessionsThisWeek = function() {
		var currentWeekday = new Date().getDay();
		return 2;
	};
}

function SessionsCtrl($scope, $http, $location, Sessions, Goals, Instruments) {
	$scope.Sessions = Sessions;
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Sessions";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.hideNavigation = false;
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/session/');
	};
}

function SessionCtrl($scope, $routeParams, $http, $location, Sessions, Goals, Instruments, Statistics, growl) {
	$scope.Goals = Goals;
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Session";
	$scope.pageSettings.active = "sessions";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.editMode = false;
	$scope.pageSettings.hideNavigation = false;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id !== null && $routeParams.id !== "")
	{
		Sessions.getSession($routeParams.id, 
			function(session) {
				console.log("Got session", session);
				$scope.session = session;
			},
			function(error) {
				alert("Couldn't get session");
			});
	}
	else
	{
		$scope.session = { date: new Date() };
		$scope.editMode = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = !$scope.editMode;
	};

	$scope.$watch("editMode", function() {
		$scope.pageSettings.hideNavigation = $scope.editMode;
		if ($scope.editMode) {
			$scope.pageSettings.hideNavigation = true;
			$scope.pageSettings.rightButtonText = "Cancel";
			$scope.pageSettings.showBackButton = false;			
		} 
		else {
			$scope.pageSettings.hideNavigation = false;
			$scope.pageSettings.rightButtonText = "Edit";
			$scope.pageSettings.showBackButton = true;						
		}
	});

	$scope.save = function()
	{
		Sessions.saveSession($scope.session, 
			function() {
				$location.path("/sessions/");
				Statistics.flushStats();
				growl.addSuccessMessage('Session saved', { ttl:3000 });
			},
			function() {
				alert("Error saving session");
			}
		);


	};

	$scope.delete = function() {
		Sessions.deleteSession($scope.session._id,
			function() {
				$location.path("/sessions/");
			},
			function(error) {
				alert("Could not delete the session.");
			}
		);
	};
}

function GoalsCtrl($scope, $http, $location, Goals) {
	$scope.Goals = Goals;
	$scope.pageSettings.pageTitle = "Goals";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = "New";
	$scope.pageSettings.hideNavigation = false;
	$scope.pageSettings.rightButtonClick = function() {
		$location.path('/goal/');
	};
}

function GoalCtrl($scope, $routeParams, $http, $location, Goals) {
	$scope.pageSettings.pageTitle = "Goal";
	$scope.pageSettings.active = "goals";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.pageSettings.hideNavigation = false;
	$scope.editMode = false;
	$scope.Goals = Goals;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id !== null && $routeParams.id !== "") {
		Goals.getGoal($routeParams.id, function(goal) {
			$scope.goal = goal;
		}, function() { alert("Couldn't get goal");});
	}
	else {
		$scope.goal = { date: new Date() };
		$scope.editMode = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = !$scope.editMode;
		$scope.pageSettings.showBackButton = !$scope.pageSettings.showBackButton;
		if ($scope.pageSettings.rightButtonText == "Edit")
			$scope.pageSettings.rightButtonText = "Cancel";
		else
			$scope.pageSettings.rightButtonText = "Edit";
	};

	$scope.getDate = function() {
		return new Date();
	};

	$scope.save = function()
	{
		Goals.saveGoal($scope.goal, 
			function() {
				$location.path('/goals/');
			}, 
			function() {
				alert("Error saving goal");
			});
	};

	$scope.delete = function() {
		Goals.deleteGoal($scope.goal._id,
			function() {
				$location.path('/goals/');
			}, 
			function() {
				alert("Couldn't delete goal");
			});
	};
}

function StatsCtrl($scope, $http, Statistics, Goals, Instruments) {
	$scope.Goals = Goals;	
	$scope.Statistics = Statistics;
	$scope.Instruments = Instruments;
	Statistics.getSessionsPerWeekday();
	Statistics.getMinutesPerDay(30);
	Statistics.getSessionsPerWeek(10);
	$scope.pageSettings.pageTitle = "Statistics";
	$scope.pageSettings.active = "stats";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
	$scope.pageSettings.hideNavigation = false;
	Statistics.getStatsOverview();
	Statistics.getWeekStats();

	$scope.$watch("Statistics.statsOverview", function () {
		console.log("statsOverview reloaded!");
		$scope.statsOverview = Statistics.statsOverview;
	});
	$scope.$watch("Statistics.weekStats", function () {
		console.log("weekStats reloaded!");
		$scope.weekStats = Statistics.weekStats;
	});


	$scope.$watch("Statistics.minutesPerDay", function() {
		$scope.last30days = {
			labels: Statistics.minutesPerDay.labels,
			datasets: [ {
	            fillColor : "#BD934F",
	            strokeColor : "#f1c40f",
	            pointColor : "#BD934F",
	            pointStrokeColor : "#f1c40f",
	            data : Statistics.minutesPerDay.data
			} ]
		};
	});

	$scope.weekdayColors = [ "#bb0000", "#bbbb00", "#00bb00", "#00bbbb", "#0000bb", "#bb00bb", "#000000"];

	$scope.$watch("Statistics.perWeekday", function() {
		$scope.perWeekday = [];
		for (i = 1; i <= 7; i++) {
			$scope.perWeekday.push({ value: Statistics.perWeekday[i % 7], color: $scope.weekdayColors[i % 7] });
		}
	}, true);

	$scope.$watch("Statistics.sessionsPerWeek", function() {
		$scope.sessionsPerWeek = {
			labels: Statistics.sessionsPerWeek.labels,
			datasets: [{
	            fillColor : "#BD934F",
	            strokeColor : "#f1c40f",
	            pointColor : "#BD934F",
	            pointStrokeColor : "#f1c40f",
	            data : Statistics.sessionsPerWeek.count		
			}]
		};

		$scope.minutesPerWeek = {
			labels: Statistics.sessionsPerWeek.labels,
			datasets: [{
	            fillColor : "#BD934F",
	            strokeColor : "#f1c40f",
	            pointColor : "#BD934F",
	            pointStrokeColor : "#f1c40f",
	            data : Statistics.sessionsPerWeek.minutes	
			}]
		};
	}, true);

	$scope.Math = Math;
}

function ProfileCtrl($scope, $rootScope, $http, $location, Instruments)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Profile";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = false;
	$scope.pageSettings.rightButtonText = null;
	$scope.pageSettings.hideNavigation = false;

	$scope.logout = function() {
		fbLogout();

		$http.post('/api/logout', {}, $rootScope.httpConfig)
			.success(function() {
				$location.path("/login");
			})
			.error(function() {
				$location.path("/login");
			});
	};
}

function InstrumentCtrl($scope, $http, $location, $routeParams, Instruments, $rootScope)
{
	$scope.Instruments = Instruments;
	$scope.pageSettings.pageTitle = "Instrument";
	$scope.pageSettings.active = "profile";
	$scope.pageSettings.showBackButton = true;
	$scope.pageSettings.rightButtonText = "Edit";
	$scope.pageSettings.hideNavigation = false;
	$scope.editMode = false;
	$scope._csrf = $rootScope.csrf;

	// If id is provided, get session, from memory or DB.
	if ($routeParams.id !== null && $routeParams.id !== "")
	{
		Instruments.getInstrument($routeParams.id,
			function(instrument) {
				$scope.instrument = instrument;
			},
			function() {
				alert("Could not load instrument");
			});
	}
	else
	{
		$scope.instrument = {};
		$scope.editMode = true;
		$scope.pageSettings.hideNavigation = true;
	}

	$scope.pageSettings.rightButtonClick = function() {
		$scope.editMode = !$scope.editMode;
		$scope.pageSettings.hideNavigation = $scope.editMode;
		$scope.pageSettings.showBackButton = !$scope.pageSettings.showBackButton;
		if ($scope.pageSettings.rightButtonText == "Edit")
			$scope.pageSettings.rightButtonText = "Cancel";
		else
			$scope.pageSettings.rightButtonText = "Edit";
	};

	$scope.setImage = function(imageField) {
		$scope.files = imageField.files;
		var file = $scope.files[0];

		var reader = new FileReader();
		reader.onload = (function(selectedFile) {
		    return function(e) {
		      $scope.instrument.image = e.target.result.split(',')[1];
		    };

		})(file);
		reader.readAsDataURL(file);
	};

	$scope.save = function() {
		Instruments.saveInstrument($scope.instrument,
			function() {
				$location.path("/profile/");
			},
			function() {
				alert("Could not save instrument");
			});
	};

	$scope.delete = function() {
		Instruments.deleteInstrument($scope.instrument._id,
			function() {
				$location.path("/profile/");
			},
			function() {
				alert("Could not delete instrument");
			});
	};
}

GuitarJournalApp.factory('Goals', function($http, $rootScope) {
	var service = {};

	service.goals = undefined;

	service.getGoals = function() {
		$rootScope.apiStatus.loading++;
		$http.get('/api/goals')
			.success(function(data) {
				service.goals = data;
				$rootScope.apiStatus.loading--;
			})
			.error(function(data) {
				alert("Error when getting sessions.");
				$rootScope.apiStatus.loading--;
			});							
	}

	service.getGoal = function(goalId, successCallback, failureCallback) {
		if (service.goals) {
			// First try to find session in the loaded array
			for (i = 0; i < service.goals.length; i++)
			{
				if (service.goals[i]._id == goalId)
				{
					if (successCallback) {
						successCallback(service.goals[i]);
					}
					return;
				}
			}

			// Not loaded into memory, get from DB.
			$rootScope.apiStatus.loading++;
			$http.get('/api/goal/' + goalId)
				.success(function(data) {
					$rootScope.apiStatus.loading--;
					if (successCallback)
						successCallback(data);
				})
				.error(function(data) {
					$rootScope.apiStatus.loading--;
					failureCallback(data);
				});
		}
	}

	service.getGoalTitle = function(goalId) {
		if (service.goals) {
			var title = null;
			service.goals.some(function (goal) {
				if (goal._id == goalId) {
					title = goal.title;
					return true;
				}
			});

			return title;
		}
	}

	service.saveGoal = function(goal, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.post('/api/goals', goal, $rootScope.httpConfig)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getGoals();
				$rootScope.apiStatus.loading--;

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				$rootScope.apiStatus.loading--;
				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteGoal = function(goalId, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.delete('/api/goal/' + goalId, $rootScope.httpConfig)
			.success(function(data){
				service.getGoals();
				$rootScope.apiStatus.loading--;

				if (successCallback)
					successCallback();
			})
			.error(function(error){
				$rootScope.apiStatus.loading--;

				if (failureCallback)
					failureCallback();
			});

	}

	service.getActiveGoals = function() {
		if (service.goals) {
			var activeGoals = [];
			service.goals.forEach(function (goal){
				if (!goal.completed)
					activeGoals.push(goal);
			});
			return activeGoals;
		}
		else 
			return [];
	}

	$rootScope.$watch('loggedIn', function() {
		if ($rootScope.loggedIn) {
			service.getGoals();
		}
	});

	return service;
});
GuitarJournalApp.factory('Instruments', function($http, $rootScope) {
	var service = {};

	service.instruments = undefined;

	service.getInstruments = function() {
		$rootScope.apiStatus.loading++;
		$http.get('/api/instruments')
			.success(function(data) {
				service.instruments = data;
				$rootScope.apiStatus.loading--;
			})
			.error(function(data) {
				alert("Error when getting instruments.");
				$rootScope.apiStatus.loading--;
			});							
	}

	service.getInstrument = function(instrumentId, successCallback, failureCallback) {
		if (service.instruments) {
			// First, try to find instrument in the loaded array
			for (i = 0; i < service.instruments.length; i++)
			{
				if (service.instruments[i]._id == instrumentId)
				{
					if (successCallback) {
						successCallback(service.instruments[i]);
					}
					return;
				}
			}

			// Not loaded into memory, get from DB.
			$rootScope.apiStatus.loading++;
			$http.get('/api/instrument/' + instrumentId)
				.success(function(data) {
					$rootScope.apiStatus.loading--;
					if (successCallback)
						successCallback(data);
				})
				.error(function(data) {
					$rootScope.apiStatus.loading--;
					failureCallback(data);
				});
		}
	}

	service.getInstrumentName = function(instrumentId) {
		if (service.instruments) {
			var name = null;
			service.instruments.some(function (instrument) {
				if (instrument._id == instrumentId) {
					name = instrument.name;
				}
			});

			return name;
		}
	}

	service.getInstrumentImageData = function(instrumentId) {
		if (!instrumentId)
			return "";
		if (service.instruments) {
			var name = null;
			var imageData = null;
			service.instruments.some(function (instrument) {
				if (instrument._id == instrumentId) {
					imageData = instrument.image;
				}
			});

			if (imageData) {
				return "data:image/jpeg;base64," + imageData;			
			}
			else {
				return "";				
			}
		}		
	}

	service.saveInstrument = function(instrument, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;

		$http.post('/api/instruments', instrument, $rootScope.httpConfig)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getInstruments();
				$rootScope.apiStatus.loading--;

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				$rootScope.apiStatus.loading--;

				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteInstrument = function(instrumentId, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.delete('/api/instrument/' + instrumentId, $rootScope.httpConfig)
			.success(function(data){
				service.getInstruments();
				$rootScope.apiStatus.loading--;
				if (successCallback)
					successCallback();
			})
			.error(function(error){
				$rootScope.apiStatus.loading--;
				if (failureCallback)
					failureCallback();
			});

	}

	$rootScope.$watch('loggedIn', function() {
		if ($rootScope.loggedIn) {
			service.getInstruments();
		}
	});

	return service;
});
GuitarJournalApp.factory('Sessions', function($http, $rootScope) {
	var service = {};
	service.sessions = undefined;

	service.getSessions = function(loadMore) {
		$rootScope.apiStatus.loading++;
		var url = '/api/sessions';
		if (!loadMore) {
			service.sessions = [];
		}
		else {
			url += '/' + service.sessions.length;
		}

		$http.get(url)
			.success(function(data) {
				service.sessions = service.sessions.concat(data);
				$rootScope.apiStatus.loading--;
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});							
	}

	service.getSession = function(sessionId, successCallback, failureCallback) {
		console.log("Getting session");
		if (service.sessions) {
			// First, try to find session in the loaded array
			for (i = 0; i < service.sessions.length; i++)
			{
				if (service.sessions[i]._id == sessionId)
				{
					if (successCallback) {
						successCallback(service.sessions[i]);
					}
					return;
				}
			}
		}
		else
		{
			// Not loaded into memory, get from DB.
			$rootScope.apiStatus.loading++;
			$http.get('/api/session/' + sessionId)
				.success(function(data) {
					$rootScope.apiStatus.loading--;
					if (successCallback)
						successCallback(data);
				})
				.error(function(data) {
					$rootScope.apiStatus.loading--;
					failureCallback(data);
				});
		}
	}

	service.saveSession = function(session, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;
		$http.post('/api/sessions', session, $rootScope.httpConfig)
			.success(function(data) {
				// 1 means updated, otherwise replace to get proper db id.
				service.getSessions();
				$rootScope.apiStatus.loading--;

				if (successCallback)
					successCallback();
			})
			.error(function(data) { 
				$rootScope.apiStatus.loading--;

				if (failureCallback)
					failureCallback();
			});
	}

	service.deleteSession = function(sessionId, successCallback, failureCallback) {
		$rootScope.apiStatus.loading++;

		$http.delete('/api/session/' + sessionId, $rootScope.httpConfig)
			.success(function(data){
				service.getSessions();
				$rootScope.apiStatus.loading--;

				if (successCallback)
					successCallback();
			})
			.error(function(error){
				$rootScope.apiStatus.loading--;

				if (failureCallback)
					failureCallback();
			});

	}

	$rootScope.$watch('loggedIn', function() {
		if ($rootScope.loggedIn) {
			service.getSessions();
		}
	})
	return service;
});
GuitarJournalApp.factory('Statistics', function($http, $rootScope) {
	var service = {};
	service.statsOverview = undefined;
	service.weekStats = undefined;

	service.getSessionsPerWeekday = function() {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/perweekday';
		service.perWeekday = [];

		$http.get(url)
			.success(function(data) {
				if (data) {
					var dataWeekday = 0;
	
					for (currentWeekday = 0; currentWeekday < 7; currentWeekday++) {
						var sessionCount = 0;
	
						while (dataWeekday < data.length && data[dataWeekday].weekDay < currentWeekday) {
							dataWeekday++;
						}
	
						if (dataWeekday < data.length && data[dataWeekday].weekDay == currentWeekday)
							service.perWeekday.push(data[dataWeekday].sessionCount);
						else
							service.perWeekday.push(0);
					}
					$rootScope.apiStatus.loading--;
				}
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});			
	};

	service.getMinutesPerDay = function(days) {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/minutesperday/' + days;
		service.minutesPerDay = {};
		service.minutesPerDay.labels = [];
		service.minutesPerDay.data = [];

		$http.get(url)
			.success(function(data) {
				if (data && data.length && data.length > 0) {
					var start = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
					var currentDataIndex = 0;
					var currentDataDate = null;
					currentDataDate = new Date(data[currentDataIndex]._id.year, data[currentDataIndex]._id.month - 1, data[currentDataIndex]._id.day);

					for (i = 29; i >= 0; i--) {
						var currentDate = new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).setDate(new Date().getDate() - i));

						while (currentDataIndex < data.length - 1 && currentDataDate < currentDate) {
							currentDataIndex++;
							currentDataDate = new Date(data[currentDataIndex]._id.year, data[currentDataIndex]._id.month - 1, data[currentDataIndex]._id.day);
						}

						if (i % 5 == 0)
							service.minutesPerDay.labels.push(moment(currentDate).format('MM-DD'));
						else
							service.minutesPerDay.labels.push("");

						if (currentDataIndex < data.length && currentDate - currentDataDate === 0)
							service.minutesPerDay.data.push(data[currentDataIndex].totalMinutes);
						else
							service.minutesPerDay.data.push(0);
					}						
				}

				$rootScope.apiStatus.loading--;
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});							
	};

	service.getSessionsPerWeek = function (weeks) {
		$rootScope.apiStatus.loading++;
		var url = '/api/statistics/perweek/' + weeks;
		service.sessionsPerWeek = {};
		service.sessionsPerWeek.labels = [];
		service.sessionsPerWeek.count = [];
		service.sessionsPerWeek.minutes = [];

		$http.get(url)
			.success(function(data) {
				if (data && data.length && data.length > 0) {
					var currentDataIndex = 0;

					for (i = 0; i < weeks; i++) {
						var currentWeek = moment().subtract(moment.duration(weeks - i, 'weeks')).isoWeek();
						service.sessionsPerWeek.labels.push(currentWeek);

						while (currentDataIndex < (data.length - 1) && data[currentDataIndex].week < currentWeek) {
							currentDataIndex++;
						}

						if (data[currentDataIndex].week == currentWeek) {
							service.sessionsPerWeek.count.push(data[currentDataIndex].count);
							service.sessionsPerWeek.minutes.push(data[currentDataIndex].minutes);

						}
						else {
							service.sessionsPerWeek.count.push(0);
							service.sessionsPerWeek.minutes.push(0);
						}
					}
				}
				$rootScope.apiStatus.loading--;
			})
			.error(function(data, status) {
				alert("Error when getting sessions");
				$rootScope.apiStatus.loading--;
			});							
	};

	service.getStatsOverview = function () {
		if (typeof service.statsOverview == undefined || service.statsOverview == null) {
			$rootScope.apiStatus.loading++;
			$http.get('/api/statistics/overview')
				.success(function(data) {
					service.statsOverview = data;
					var firstSession = new Date(service.statsOverview.firstSession);
					var lastSession = new Date(service.statsOverview.latestSession);
					var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
					var weeks = Math.max(days/7, 1);
					service.statsOverview.sessionsPerWeek = Math.round(service.statsOverview.totalSessions / weeks * 100)/100;
					$rootScope.apiStatus.loading--;
				})
				.error(function(data) {
					$rootScope.apiStatus.loading--;
					alert("Error when getting statistics overview.");
				});
		}
	};

	service.getWeekStats = function () {
		if (typeof service.weekStats == undefined || service.weekStats == null) {
			$rootScope.apiStatus.loading++;
			$http.get('/api/statistics/overview/7')
				.success(function(data) {
					service.weekStats = data;
					var firstSession = new Date(service.weekStats.firstSession);
					var lastSession = new Date(service.weekStats.latestSession);
					var days = Math.round(lastSession.getTime() - firstSession.getTime())/86400000;
					var weeks = days/7;
					service.weekStats.sessionsPerWeek = Math.round(service.weekStats.totalSessions / weeks * 100)/100;
					$rootScope.apiStatus.loading--;
				})
				.error(function(data) {
					$rootScope.apiStatus.loading++;
					alert("Error when getting statistics overview.");
				});
		}
	}

	service.flushStats = function() {
		service.statsOverview = undefined;
		service.weekStats = undefined;
	}

	return service;
});
var nonbounce = function(elems) {
    var cont;
    var startY;
    var idOfContent = "";
    nonbounce_touchmoveBound = false;

    var isContent = function(elem) {
        var id = elem.getAttribute("id");
        
        while (id !== idOfContent && elem.nodeName.toLowerCase() !== "body") {
            elem = elem.parentNode;
            id = elem.getAttribute("id");
        }
        
        return (id === idOfContent);
    };
    
    var touchstart = function(evt) {
        // Prevents scrolling of all but the nonbounce element
        if (!isContent(evt.target)) {
            evt.preventDefault();
            return false;
        }

        startY = (evt.touches) ? evt.touches[0].screenY : evt.screenY;
    };
    
    var touchmove = function(evt) {
        var elem = evt.target;

        var y = (evt.touches) ? evt.touches[0].screenY : evt.screenY;
        
        // Prevents scrolling of content to top
        if (cont.scrollTop === 0 && startY <= y) {
            evt.preventDefault();
        }
        
        // Prevents scrolling of content to bottom
        if (cont.scrollHeight-cont.offsetHeight === cont.scrollTop && startY >= y) {
            evt.preventDefault();
        }
    }
    
    if (typeof elems === "string") {
        cont = document.getElementById(elems);
        
        if (cont) {
            idOfContent = cont.getAttribute("id");
            window.addEventListener("touchstart", touchstart, false);
        }
    }
    
    if (!nonbounce_touchmoveBound) {
        window.addEventListener("touchmove", touchmove ,false);
    }
};