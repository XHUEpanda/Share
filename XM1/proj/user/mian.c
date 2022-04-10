#include "main.h"

sbit ALAM=P2^6;
sbit state=P2^7;//�������оͻ��Ժ�ɫ

void main(void){
	int nowLen,nowAng,objLen;//nowLen��ǰ���Ƹ˳��ȣ�nowAng��ǰ��̬
	int timeOutFlag,flagPID;;
	ALAM=0;
	InitADC();
	InitMotor();
	InitAng();	
	state=0;
	while(1){
		nowLen=GetLen();//��ȡ��ǰ�Ƹ˳���
		nowAng=GetAng();//��ȡ��ǰ�Ƕ�
		objLen=GetObjLen(nowAng);//��ȡĿ���Ƹ˳���

		flagPID=PIDMotor(nowLen-objLen)/20;
		printf("error:%d",nowLen);
		if(flagPID>100||flagPID<-100){
			if(nowLen-objLen>LENERROR){ //�����ǰ���ȴ���Ŀ�곤��
				//MoveN(PIDMotor(10)); PID������
				MoveN(10);
				timeOutFlag++;
			}

			if(objLen-nowLen>LENERROR){ //�����ǰ����С��Ŀ�곤��
				//MoveP(PIDMotor(10));
				MoveP(10);
				timeOutFlag++;
			}
			
			if(objLen-nowLen<LENERROR&&nowLen-objLen<LENERROR){
				timeOutFlag=0;
			}
		}
		
		if(timeOutFlag>=TIMEOUT){//���������ɹ���
			ALAM=1;
		}
		state=~state;
	}
}
