
var a="dsdas";
alert(a)

var obj={name:"dsa",py:"dsa"};
obj.name="sd";

obj.sayName=function(a,b,c){
    var d=a+b+c;
    return d;
};
var a=2;
(function(){
    alert("立即函数");
})();

(function(a,b){
    console.log("立即函数"+a+b)
})(1,2)



console.log(obj.sayName(1,3,5));