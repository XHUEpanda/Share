#include "angle.h"

unsigned char receiveData;
int stage;
int angBuff=0;
int ang=0; 

void InitAng(void){
	SCON=0X50;			//设置为工作方式1
	TMOD=0X20;			//设置计数器工作方式2
	TH1=0xFD;	//计数器初始值设置
	TL1=0xFD;
	ES=1;				//打开接收中断
	EA=1;				//打开总中断
	TR1=1;				//打开计数器
	TI=1;          //发送中断标记位，如果使用printf函数的必须设置
}

//得到角度
int GetAng(void){
	int rAng;
	rAng=(int)(ang*181.0/32768);
	return rAng;
}

void UsartSendByte(unsigned char byte)
{
	ES=0;
	TI=0;
	SBUF=byte;	//缓冲区装载要发送的字节
	while(TI==0);//等待发送数据完成，TI标志位会置1
	TI=0;		//清空发送中断标志位
	ES=1;
}

//串口重新定向能够使用printf函数
char putchar(char c)
{
	UsartSendByte(c);
	return c;
}

void Usart() interrupt 4	//串口中断号
{
	if(RI){
		receiveData=SBUF;  //出去接收到的数据	  接收中断标志位	
		if(stage==3){
			angBuff=angBuff<<8|receiveData;
			ang=angBuff;
			stage=0;
		}
		if(stage==2){
			angBuff=(int)receiveData;
			stage=3;
		}
		if(receiveData==0x06&&stage==1){
			stage=2;
		}
		if(receiveData==0x03){
			stage=1;
		}
		RI = 0;			   //清除接收中断标志位
	}
}
