#include "main.h"

sbit ALAM=P2^6;
sbit state=P2^7;//正常运行就会显红色

void main(void){
	int nowLen,nowAng,objLen;//nowLen当前的推杆长度，nowAng当前姿态
	int timeOutFlag,flagPID;;
	ALAM=0;
	InitADC();
	InitMotor();
	InitAng();	
	state=0;
	while(1){
		nowLen=GetLen();//获取当前推杆长度
		nowAng=GetAng();//获取当前角度
		objLen=GetObjLen(nowAng);//获取目标推杆长度

		flagPID=PIDMotor(nowLen-objLen)/20;
		printf("error:%d",nowLen);
		if(flagPID>100||flagPID<-100){
			if(nowLen-objLen>LENERROR){ //如果当前长度大于目标长度
				//MoveN(PIDMotor(10)); PID调节器
				MoveN(10);
				timeOutFlag++;
			}

			if(objLen-nowLen>LENERROR){ //如果当前长度小于目标长度
				//MoveP(PIDMotor(10));
				MoveP(10);
				timeOutFlag++;
			}
			
			if(objLen-nowLen<LENERROR&&nowLen-objLen<LENERROR){
				timeOutFlag=0;
			}
		}
		
		if(timeOutFlag>=TIMEOUT){//如果误差依旧过大
			ALAM=1;
		}
		state=~state;
	}
}
