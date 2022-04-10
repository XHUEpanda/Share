import { interpolate } from "gsap/all";
import * as mo from "movy";

/**
 * 定义socket
 */
 var http = require('http');
 var fs = require('fs');
 
 var server = http.createServer(function (req,res){
     fs.readFile('./index.html',function(error,data){
         res.writeHead(200,{'Content-Type':'text/html'});
         res.end(data,'utf-8');
     });
 }).listen(8085,"127.0.0.1");
 console.log('Server running at http://127.0.0.1:8085/');
 
 var io = require('socket.io')(server);
 
 io.sockets.on('connection',function(socket){
     socket.on('message',function(data){
         socket.broadcast.emit('push message',data);
 
     });
 });

//定义s盒
var sBox = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];

//定义密钥
let key=[0x3C,0xA1,0x0B,0x21,
         0x57,0xF0,0x19,0x16,
         0x90,0x2E,0x13,0x80,
         0xAC,0xC1,0x07,0xBD];

//待加密明文的编码
/*const p=["1","2","3","4",
         "5","6","7","8",
         "9","A","B","C",
         "D","E","F","10"];
*/
const p=[0x1,0x2,0x3,0x4,
        0x5,0x6,0x7,0x8,
        0x9,0xa,0xb,0xc,
        0xd,0xe,0xf,0x10];

//矩阵形状
const gridSize = [5, 5];


/**密钥生成相关动画
 * 
 */
//定义标题
const title0 = mo.addText("密钥扩展轮&密钥加",{
  position:[0,4],
  fontSize:0.5,
}).reveal();

const group001 = mo.addGroup({
  scale: 1.5,
  position:[-4,0]
});

//密钥扩展公式
const keyFormu0="W[i] = W[i-1] \\oplus T(W[i-3])";
const keyFormu1="W[i] = W[i-1] \\oplus W[i-3]";
const keyFormu2="W[i] = W[i-1] \\oplus W[i-3]";
const keyFormu3="W[i] = W[i-1] \\oplus W[i-3]";
const t00=mo.addTex(keyFormu0,{scale:0.25,position:[2,2.25]});
const t01=mo.addTex(keyFormu1,{scale:0.25,position:[2,0.75]});
const t02=mo.addTex(keyFormu2,{scale:0.25,position:[2,-0.75]});
const t03=mo.addTex(keyFormu3,{scale:0.25,position:[2,-2.25]});
//密钥动画生成
let num = 1;
for (let i = 1; i < gridSize[1]; i++) {
  for (let j = 1; j < gridSize[0]; j++) {
    const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];
    const colorList=["#EDCF23","#B0C4DE","#B0C4DE","#B0C4DE"]
    group001.addText('0x'+GetHex(key[num-1]), {
      position: pos.concat([0.02]),
      scale: 0.25,
      font: "math",
      color:  "white",
    });

    group001.addRectOutline({ position: pos, lineWidth: 0.05 });
    group001.addRect({
          position: [pos[0], pos[1], -0.1],
          color: colorList[i-1],
        })
        .grow2({
          t: "<0.3",
        });
    num++;
  }
}



/**第一步轮密钥加
 * 
 */
 const group0 = mo.addGroup({
  scale: 1.5,
  position:[0,20]
});

//移动矩阵
group001.moveTo({position:[-20,0]});
t00.moveTo({position:[-20,0]});
t01.moveTo({position:[-20,0]});
t02.moveTo({position:[-20,0]});
t03.moveTo({position:[-20,0]});
group0.moveTo({position:[0,0],duration:1,t:'<'});

let keyW=ExtenKey(key);

//密文扩展矩阵形状
const keyGridSize = [12, 5];

//生成扩展矩阵：扩展的KeyW在文末调用函数生成
num = 1;
for (let i = 1; i < keyGridSize[1]; i++) {
  for (let j = 1; j < keyGridSize[0]; j++) {
    const pos = [-keyGridSize[0] * 0.5 + j, keyGridSize[1] * 0.5 - i];

    group0.addText(GetHex(keyW[num-1]), {
      position: pos.concat([0.02]),
      scale: 0.15,
      font: "math",
      color:  "white",
    });

    group0.addRectOutline({ position: pos, lineWidth: 0.05 });
    group0.addRect({
          position: [pos[0], pos[1], -0.1],
          color: "#EDCF23",
        })
        .grow2({
          t: "<0.3",
        });
    num++;
  }
}

//轮密钥加
var midP=p;
//var midP=AddRoundKey(p,keyW,0);
console.log(midP);


/** 明文矩阵相关动画
 * 
 * 
 */

//定义标题
const title = mo.addText("第一轮1步字节代换",{
  position:[0,10],
  fontSize:0.5,
});

title0.moveTo({position:[0,20],t:'<1'});
title.moveTo({position:[0,4],t:'<1'});
group0.moveTo({position:[-20,0],t:'<'});




//定义明文矩阵
const group = mo.addGroup({
  scale: 1.5,
  position:[-20,0]
});


//生成明文矩阵
num = 1;
for (let i = 1; i < gridSize[1]; i++) {
  for (let j = 1; j < gridSize[0]; j++) {
    const objNum = isObjNum(i,j);
    const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];

    group.addText("0x"+GetHex(p[num-1]), {
      position: pos.concat([0.02]),
      scale: 0.3,
      font: "math",
      color: objNum ? "black" : "white",
    });

    group.addRectOutline({ position: pos, lineWidth: 0.05 });

    if (objNum) {
      group
        .addRect({
          position: [pos[0], pos[1], -0.1],
          color: "#EDCF23",
        })
        .grow2({
          t: "<0.1",
        });
    }
    num++;
  }
}


group.moveTo({position:[-5,0],t:'<2'});

//示例数字
function isObjNum(loci,locj) {
  let objLoc=[2,1];
  if (objLoc[0]== loci&&objLoc[1]==locj) return true;
  return false;
}

/**
 * S盒动画相关
 * 
 */



//定义S盒矩阵形状
const sBoxGridSize = [18, 18];//17*17还有一行一列是存行号或者列号的

//定义S盒矩阵
const sBoxGroup = mo.addGroup({
  scale: 0.5,
  position: [3,-1],
  title:"SBox",
});

//生成行号
for(let i=2;i < sBoxGridSize[1]; i++){
  const pos = [-sBoxGridSize[0] * 0.5 + 1, sBoxGridSize[1] * 0.5 - i];
  sBoxGroup.addText((i-2).toString(16), {
    position: pos.concat([0.02]),
    scale: 0.35,
    font: "math",
    color:  "white",
  });
}

//生成列号
for (let j = 2; j < sBoxGridSize[0]; j++){
  const pos = [-sBoxGridSize[0] * 0.5 + j, sBoxGridSize[1] * 0.5 - 1];
  sBoxGroup.addText((j-2).toString(16), {
    position: pos.concat([0.02]),
    scale: 0.35,
    font: "math",
    color:  "white",
  });
}

//生成S盒动画
num=0;
for (let i = 2; i < sBoxGridSize[1]; i++) {
  for (let j = 2; j < sBoxGridSize[0]; j++) {
    const pos = [-sBoxGridSize[0] * 0.5 + j, sBoxGridSize[1] * 0.5 - i];

    sBoxGroup.addText(sBox[num].toString(16), {
      position: pos.concat([0.02]),
      scale: 0.35,
      font: "math",
      color:  "white",
    });

    sBoxGroup.addRectOutline({ position: pos, lineWidth: 0.05 });

    num++;
  }
}

sBoxGroup.reveal({t:'<1'});

/**
 * 明文查找sbox中的值进行替换相关动画
 * 
 * 
 */
group.moveTo({position:[-20,0],t:'<1'});

//选出演示的数字
const  objNum=mo.addText("0x05", { 
  scale: 0.5,
  position:[-5,0,0],
  color:"black",
}).reveal({t:'<1',direction:"right"});

//添加外框
objNum.addRectOutline({
  scale:3.5,
  lineWidth: 0.05,
  })
  .addRect({
    color:"#EDCF23",
    position:[0,0,-0.01],
  });

//添加箭头-第一位
objNum.addArrow([0.3,0.5,0],[7.5,5,0],{
  lineWidth:0.1,
  t:"<1",
});

//凸显出替换的位置的行号和列号-第一位
sBoxGroup.addRect({
    position: [-sBoxGridSize[0] * 0.5 + 1, sBoxGridSize[1] * 0.5 - 2],
    color: "#EDCF23",
  })
  .grow2({
    t: "<0.8",
  });

//添加箭头-第二位
objNum.addArrow([0.8,0.5,0],[13.5,6,0],{
  lineWidth:0.1,
  t:"<1",
});

//凸显出替换的位置的行号和列号-第一位
sBoxGroup.addRect({
  position: [-sBoxGridSize[0] * 0.5 + 7, sBoxGridSize[1] * 0.5 - 1],
  color: "#EDCF23",
  })
  .grow2({
    t: "<0.3",
  });

//凸出被选中的值
sBoxGroup.addRect({
  position: [-sBoxGridSize[0] * 0.5 + 7, sBoxGridSize[1] * 0.5 - 2],
  color: "#EDBFF3",
  })
  .grow2({
    t: "<0.3",
  })
  .reveal();

//突出被替换的数字
const  objNum1=mo.addText("0x6b",{ 
  scale: 0.5,
  position:[-5,0,0.02],
  color:"black",
}).grow({t:'<1'});

//添加外框-替换后
objNum1.addRectOutline({
  scale:3.5,
  lineWidth: 0.05,
  })
  .addRect({
    color:"#EDCF23",
    position:[0,0,-0.01],
  });

//经过s盒替换后的明文
midP=SBoxTrans(midP);

//移走突出的演示字符
objNum.moveTo({position:[-20,0]});
objNum1.moveTo({position:[-20,0]});
//把原来的矩阵移动回来
group.moveTo({position:[-5,0]});

const objGroup = mo.addGroup({
  scale: 1.5,
  position:[-20,0],
  t:4,
});

objGroup.moveTo({position:[-5,0,0.5],t:'<'});

//整个矩阵替换的过程演示
num = 1;
for (let i = 1; i < gridSize[1]; i++) {
  for (let j = 1; j < gridSize[0]; j++) {
    const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];

    objGroup.addText("0x"+GetHex(midP[num-1]), {
      position: pos.concat([0.02]),
      scale: 0.3,
      font: "math",
      color: "black",
    }).reveal();

    objGroup.addRectOutline({ position: pos, lineWidth: 0.05 });
    objGroup
        .addRect({
          position: [pos[0], pos[1], -0.1],
          color: "#EDCF23",
        })
        .grow2({
          t: "<0.1",
        });
    
    num++;
  }
}

/**行位移过程
 * 
 * 
 * 
 */

//移走sbox
 sBoxGroup.moveTo({position:[20,-1,-0.1]});

//移动走明文矩阵
group.moveTo({position:[-20,0,-0.1]});

//移走原标题
title.moveTo({position:[0,20,-0.1]});


//标题转换
const title1 = mo.addText("第一轮第2步行位移",{
  position:[0,4],
  fontSize:0.5,
});
title1.reveal();

//把上部操作后的矩阵矩阵移动到中心
objGroup.moveTo({position:[0,0,0],t:'+=0.01'});

//标记处要移动的矩阵
num = 1;
for (let i = 1; i < gridSize[1]; i++) {
  for (let j = 1; j < gridSize[0]; j++) {
    const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];

    objGroup.addRectOutline({ position: pos, lineWidth: 0.05 });
    objGroup
        .addRect({
          position: [pos[0], pos[1], 0],
          color: j<i? 'red':"#EDCF23",
        })
        .grow2({
          t: "<0.1",
        });
    
    num++;
  }
}

//对中间数据矩阵进行行移位处理
midP=LinMove(midP);

objGroup.moveTo({position:[-5,0]});

//定义行移位后的矩阵
const objGroup2 = mo.addGroup({
  scale: 1.5,
  position:[20,0],
});

//移动回来
objGroup2.moveTo({position:[5,0],t:'<0.1'});

//生成行移位后矩阵
num = 1;
for (let i = 1; i < gridSize[1]; i++) {
  for (let j = 1; j < gridSize[0]; j++) {
    const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];

    objGroup2.addText("0x"+GetHex(midP[num-1]), {
      position: pos.concat([0.02]),
      scale: 0.3,
      font: "math",
      color:"black",
    });

    objGroup2.addRectOutline({ position: pos, lineWidth: 0.05 });

    if (objNum) {
      objGroup2
        .addRect({
          position: [pos[0], pos[1], -0.1],
          color:j>(5-i)? 'red':"#EDCF23",
        })
        .grow2({
          t: "<0.1",
        });
    }
    num++;
  }
}

//持续2s钟动画
objGroup.moveTo({position:[-5,0],duration:2});
objGroup2.moveTo({position:[5,0],duration:2});

/**列混合动画
 * 
 * 
 *  
 */




//替换标题
const title2 = mo.addText("第1轮第3步列混合",{
  position:[0,20],
  fontSize:0.5,
});

title1.moveTo({position:[0,10]});
title2.moveTo({position:[0,4]});

//移走刚才的动画
 objGroup.moveTo({position:[-20,0]});
 objGroup2.moveTo({position:[-7,0],duration:1});

//第零行公式 matex 
let linFormu0="S^{`}_{0,j} = (2 * S_{0,j}) \\oplus (3 * S_{1,j}) \\oplus S_{2,j} \\oplus S_{3,j}";
//第一行公式
let linFormu1="S^{`}_{1,j} = S_{0,j}  \\oplus (2 * S_{1,j}) \\oplus (3 * S_{2,j}) \\oplus S_{3,j} ";
//第二行公式
let linFormu2="S^{`}_{2,j} = S_{0,j} \\oplus S_{1,j}  \\oplus (2 * S_{2,j}) \\oplus (3 * S_{3,j}) ";
//第三行公式
let linFormu3="S^{`}_{3,j} = (3 * S_{0,j}) \\oplus S_{1,j} \\oplus S_{2,j}  \\oplus (2 * S_{3,j}) ";

const t1 = mo.addTex(linFormu0,{scale:0.25,position:[0,-10]}).moveTo({t:'<1.3',position:[0,0]});
const t2 = mo.addTex(linFormu1,{scale:0.25});
const t3 = mo.addTex(linFormu2,{scale:0.25});
const t4 = mo.addTex(linFormu3,{scale:0.25});

//列混合
midP=CowMux(midP);

//创建列混合矩阵
const objGroup3 = mo.addGroup({
  scale: 1.5,
  position:[20,0],
});

//移动回来
objGroup3.moveTo({position:[7,0],t:'<0.1'});

//生成行移位后矩阵-第0行
num = 1;
for (let j = 1; j < gridSize[0]; j++) {
  let i=1;
  const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];
  objGroup3.addText("0x"+GetHex(midP[num-1]), {
    position: pos.concat([0.02]),
    scale: 0.3,
    font: "math",
    color:"black",
  });
  objGroup3.addRectOutline({ position: pos, lineWidth: 0.05 });
  if (objNum) {
    objGroup3
      .addRect({
        position: [pos[0], pos[1], -0.1],
        color:"#EDCF23",
      })
      .grow2({
        t: "<0.1",
      });
  }
  num++;
}


//同时改变表达式-第1行
t1.transformTexTo(t2,{t:'<2',duration:2});

for (let j = 1; j < gridSize[0]; j++) {
  let i=2;
  const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];
  objGroup3.addText("0x"+GetHex(midP[num-1]), {
    position: pos.concat([0.02]),
    scale: 0.3,
    font: "math",
    color:"black",
  });
  objGroup3.addRectOutline({ position: pos, lineWidth: 0.05 });
  if (objNum) {
    objGroup3
      .addRect({
        position: [pos[0], pos[1], -0.1],
        color:"#EDCF23",
      })
      .grow2({
        t: "<0.1",
      });
  }
  num++;
}



//同时改变表达式-第2行
t2.transformTexTo(t3,{t:'<2',duration:2});

for (let j = 1; j < gridSize[0]; j++) {
  let i=3;
  const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];
  objGroup3.addText("0x"+GetHex(midP[num-1]), {
    position: pos.concat([0.02]),
    scale: 0.3,
    font: "math",
    color:"black",
  });
  objGroup3.addRectOutline({ position: pos, lineWidth: 0.05 });
  if (objNum) {
    objGroup3
      .addRect({
        position: [pos[0], pos[1], -0.1],
        color:"#EDCF23",
      })
      .grow2({
        t: "<0.1",
      });
  }
  num++;
}


//同时改变表达式-第三行
t3.transformTexTo(t4,{t:'<2',duration:2});

for (let j = 1; j < gridSize[0]; j++) {
  let i=4;
  const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];
  objGroup3.addText("0x"+GetHex(midP[num-1]), {
    position: pos.concat([0.02]),
    scale: 0.3,
    font: "math",
    color:"black",
  });
  objGroup3.addRectOutline({ position: pos, lineWidth: 0.05 });
  if (objNum) {
    objGroup3
      .addRect({
        position: [pos[0], pos[1], -0.1],
        color:"#EDCF23",
      })
      .grow2({
        t: "<0.2",
      });
  }
  num++;
}

/**轮密钥加
 * 
 * 
 * 
 */
const title3=mo.addText("第一轮第4步轮密钥加",{
  position:[0,20],
  fontSize:0.5,
});
title2.moveTo({position:[0,20]});
title3.moveTo({position:[0,4]});
//移走前一个矩阵
objGroup2.moveTo({position:[-20,0]});
t4.moveTo({position:[-20,0]});
objGroup3.moveTo({position:[-7,0],duration:1});

//显示对应的扩展轮数矩阵
let kwLin1="0x"+GetHex(keyW[4]) ;
let kwLin2="0x"+GetHex(keyW[5]);
let kwLin3="0x"+GetHex(keyW[6]);
let kwLin4="0x"+GetHex(keyW[7]);
let tex="\\oplus    \\begin{pmatrix}"
        +kwLin1+"\\\\"
        +kwLin2+"\\\\"
        +kwLin3+"\\\\"
        +kwLin4+"\\end{pmatrix}\\quad";


const t5=mo.addTex(tex,{scale:0.5,position:[20,0]});
t5.moveTo({position:[5,0]});

//进行轮密钥加运算
midP=AddRoundKey(midP,keyW,1);
objGroup3.moveTo({position:[-20,0],t:'<'});

const objGroup4=mo.addGroup({
  scale: 1.5,
  position:[-20,0],
});
objGroup4.moveTo({position:[-7,0],t:'<'});

//将轮密钥加过的值换入其中
num = 1;
for(let i = 1; i < gridSize[0]; i++){
 for (let j = 1; j < gridSize[0]; j++) {
   const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i,3];

   objGroup4.addRectOutline({ position: pos, lineWidth: 0.05 });
   objGroup4.addRect({
         position: [pos[0], pos[1], 1],
         color:"#B0C4DE",
       })
       .grow2({
         t: "<0.1",
       });
       objGroup4.addText("0x"+GetHex(midP[num-1]), {
        position: [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i,2],
        scale: 0.3,
        font: "math",
        color:"black",
        
      });
   num++;
 }
}
//objGroup4.moveTo({position:[-7,0],duration:3});
//t5.moveTo({position:[5,0],duration:3});
 /**介绍总流程
  * 
  * 
  * 
  */
objGroup4.moveTo({position:[-20,0],t:'+=3'});
t5.moveTo({position:[20,0],t:'<'});

const img1=mo.addImage("allFLow.png",{position:[25,0],scale:8});
img1.moveTo({position:[0,0],t:'<'});

title3.moveTo({position:[0,20]});
const title4=mo.addText("AES加密总过程",{
  position:[0,4],
  fontSize:0.5,}
  ).reveal({position:[0,8],t:'<'});
title4.moveTo({position:[0,5.5],t:'+=3'});

/**
 * 展示加密后的明文
 */
img1.moveTo({position:[-50,0],t:'<'});
group.moveTo({position:[-5,0]});
title4.moveTo({position:[0,10]});
//得到密文
let cipher=AESGen(p,key);

//声明密文的矩阵形状
const group1=mo.addGroup({
  scale: 1.5,
  position:[-20,0]
}).moveTo({position:[5,0],t:'+=2'});

//密文部分标题
const title5=mo.addText("加密后的密文",{
  position:[0,4],
  fontSize:0.5,}
  ).reveal({position:[0,8],t:'<'});
title5.moveTo({position:[0,4],});

//生成密文矩阵
num = 1;
for (let i = 1; i < gridSize[1]; i++) {
  for (let j = 1; j < gridSize[0]; j++) {
    const objNum = isObjNum(i,j);
    const pos = [-gridSize[0] * 0.5 + j, gridSize[1] * 0.5 - i];

    group1.addText("0x"+GetHex(cipher[num-1]), {
      position: pos.concat([0.02]),
      scale: 0.3,
      font: "math",
      color: "black",
    });

    group1.addRectOutline({ position: pos, lineWidth: 0.05 });
    group1.addRect({
      position: [pos[0], pos[1], -0.1],
      color: "#EDCF23",
    }).grow2({
        t: "<0.1",
      });

    num++;
  }
}


 /**要用到的函数
  * 
  * 
  * 
  */
 
//得到自动补齐2位的16进制数
function GetHex(num) {
  let out=num.toString(16);
  if(out.length<=1){
    return('0'+out);
  }
  return out;
}

//数字在G2 8 域的乘法

/*function GFMut2(s){
  let out=parseInt("0x"+s);
  out=out<<1;
  let a7=out&parseInt("0x00000100");
  if(a7!=0){
    out=out&parseInt("0x000000ff");
    out=out^parseInt("0x1b");
  }
  return GetHex(out);
}

function GFMut3(s){
  let out=parseInt("0x"+GFMut2(s));
  out=out^parseInt("0x"+s);
  return GetHex(out);
}

//将16进制数进行亦或
function AESXOR(num1,num2){
  let n1=parseInt("0x"+num1);
  let n2=parseInt("0x"+num2);
  n1=n1^n2;
  return GetHex(n1);
}

//s盒替换
function SBoxTrans(pIn){
  let out=new Array();
  for(let i=0;i<16;i++){
    let obj=GetHex(pIn[i]);
    let lin=parseInt(obj[0],16);
    let cow=parseInt(obj[1],16);
    out.push(sBox[lin*16+cow]);
  }
  return out;
}
*/

function GFMut2(s){
  let out=s;
  out=out<<1;
  let a7=out&0x00000100;
  if(a7!=0){
    out=out&0x000000ff;
    out=out^0x1b;
  }
  return out;
}

function GFMut3(s){
  let out=GFMut2(s);
  out=out^s;
  return out;
}

//将16进制数进行亦或
function AESXOR(num1,num2){
  let n1=num1;
  let n2=num2;
  n1=n1^n2;
  return n1;
}

//s盒替换
function SBoxTrans(pIn){
  let out=new Array();
  for(let i=0;i<16;i++){
    let obj=GetHex(pIn[i]);
    let lin=parseInt(obj[0],16);
    let cow=parseInt(obj[1],16);
    out.push(sBox[lin*16+cow]);
  }
  return out;
}

//给一个字用的S盒替换
function SBoxTransW(pIn){
  let out;
  for(let i=0;i<4;i++){
    let obj=GetHex(pIn);
    let lin=parseInt(obj[i*2],16);
    let cow=parseInt(obj[i*2+1],16);
    //out.push(sBox[lin*16+cow]);
    out=out<<8|(sBox[lin*16+cow]);
  }
  out=out>>>0;
  return out;
}

//行移位
function LinMove(pIn){
  let out=new Array();
  let index=[0 , 1, 2,  3,
             5 , 6, 7,  4,
             10,11, 8, 9,
             15,12,13, 14];

  for(let i=0;i<16;i++){
    out.push(pIn[index[i]]);
  }
  return out;
}

let test=['C9','E5','FD','2B',
          '7A','F2','78','6E',
          '63','9C','26','67',
          'B0','A7','82','E5'];

//console.log(CowMux(test));

//列混合
function CowMux(pIn){
  let out=new Array();
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      let temp;
      if(i==0){
        temp=AESXOR(pIn[2*4+j],pIn[3*4+j]);
        temp=AESXOR(temp,GFMut2(pIn[0*4+j]));
        temp=AESXOR(temp,GFMut3(pIn[1*4+j]));
      }
      if(i==1){
        temp=AESXOR(pIn[0*4+j],pIn[3*4+j]);
        temp=AESXOR(temp,GFMut2(pIn[1*4+j]));
        temp=AESXOR(temp,GFMut3(pIn[2*4+j]));
      }
      if(i==2){
        temp=AESXOR(pIn[0*4+j],pIn[1*4+j]);
        temp=AESXOR(temp,GFMut2(pIn[2*4+j]));
        temp=AESXOR(temp,GFMut3(pIn[3*4+j]));
      }
      if(i==3){
        temp=AESXOR(pIn[1*4+j],pIn[2*4+j]);
        temp=AESXOR(temp,GFMut2(pIn[3*4+j]));
        temp=AESXOR(temp,GFMut3(pIn[0*4+j]));
      }
      out.push(temp);
    }
  }
  return out;
}

//将16个字节转化为4个字 
function ByteToW(kIn){
  let num1=0;
  let out=new Array();
  for(let i=0;i<4;i++){
    let temp=0;
    for(let j=0;j<4;j++){
      temp=temp<<8|kIn[num1];
      num1++;
    }
    temp=temp>>>0;//转换为无符号数
    out.push(temp);
    temp=0;
  }
  return out;
}


//T函数
function T(wIn,RoundOfKeyGen){
  let temp=wIn>>>0;
  //console.log((temp<<8>>>0).toString(16));
  let out=(temp<<8>>>0)|((0xff>>>0)&(wIn>>24>>>0));
  out=out>>>0;
  //console.log(out.toString(16));
  out=SBoxTransW(out);
  //console.log(out.toString(16));
  let Rcon=[0x01000000,0x02000000,0x4000000,0x10000000,0x20000000,0x40000000,0x80000000,0x1B000000,0x36000000];
  out=out^(Rcon[RoundOfKeyGen]);
  out=out>>>0;
  //console.log(out.toString(16));
  return out;
}

//扩展密钥
function ExtenKey(kIn){
  let w=ByteToW(kIn);
  let num1=4;
  let temp;
  let RoundOfKeyGen=0;
  for(let i=0;i<10;i++){
    temp=w[num1-4]^T(w[num1-1],RoundOfKeyGen);
    w.push(temp>>>0);//先处理4的倍数的
    //console.log(w[3].toString(16));
    num1++;
    for(let j=1;j<4;j++){
      temp=w[num1-4]^w[num1-1];
      w.push(temp>>>0);//再计算不是4的倍数的
      num1++;
    }
    RoundOfKeyGen++;
  }
  return w;
}


//轮密钥加
function AddRoundKey(pIn,kWIn,round){
  let num1=0;
  let out=new Array();

  for(let i=0;i<4;i++){
    let temp=kWIn[round*4+i].toString();
    for(let j=0;j<4;j++){
      let tempInt=parseInt(temp[j*2]+temp[j*2+1],16);
      temp=AESXOR(pIn[num1],tempInt);
      out.push(temp);
      num1++;
    }
  }
  return out;
}

//AES加密
function AESGen(pIn,keyIn){
  let keyW=ExtenKey(keyIn);
  let temp=AddRoundKey(pIn,keyW,0);
  for(let i=1;i<=9;i++){
    temp=SBoxTrans(temp);
    temp=LinMove(temp);
    temp=CowMux(temp);
    temp=AddRoundKey(temp,keyW,i);
  }
  temp=SBoxTrans(temp);
  temp=LinMove(temp);
  temp=AddRoundKey(temp,keyW,10);
  return temp;
}

console.log(AESGen(p,key));