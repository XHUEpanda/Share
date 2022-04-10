var TestP='0xffffffff';//验证用明文
var TestKey='0x00112233445566778899112233445566';//密钥

var Sbox=new Array();
Sbox=[[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x78],
      [0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      []];
var LenOfKey=128;//密钥长度
var EncrClc;//加密轮数
switch(LenOfKey){
    case 128:EncrClc=10;break;
    case 192:EncrClc=12;break;
    case 256:EncrClc=14;break;
    default:EncrClc=10;break;
}

//轮密钥加p:明文矩阵,w:密钥矩阵
function KeyPro(text,W){

}

//字节替换p:明文矩阵,cycNum:加密轮数
function BetyPro(text,cycNum){

}

//行移位p:明文
function LinMove(text){

}

//列混合
function LinMex(text){

}

//加密系统
