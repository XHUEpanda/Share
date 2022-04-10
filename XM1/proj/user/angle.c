#include "angle.h"

unsigned char receiveData;
int stage;
int angBuff=0;
int ang=0; 

void InitAng(void){
	SCON=0X50;			//����Ϊ������ʽ1
	TMOD=0X20;			//���ü�����������ʽ2
	TH1=0xFD;	//��������ʼֵ����
	TL1=0xFD;
	ES=1;				//�򿪽����ж�
	EA=1;				//�����ж�
	TR1=1;				//�򿪼�����
	TI=1;          //�����жϱ��λ�����ʹ��printf�����ı�������
}

//�õ��Ƕ�
int GetAng(void){
	int rAng;
	rAng=(int)(ang*181.0/32768);
	return rAng;
}

void UsartSendByte(unsigned char byte)
{
	ES=0;
	TI=0;
	SBUF=byte;	//������װ��Ҫ���͵��ֽ�
	while(TI==0);//�ȴ�����������ɣ�TI��־λ����1
	TI=0;		//��շ����жϱ�־λ
	ES=1;
}

//�������¶����ܹ�ʹ��printf����
char putchar(char c)
{
	UsartSendByte(c);
	return c;
}

void Usart() interrupt 4	//�����жϺ�
{
	if(RI){
		receiveData=SBUF;  //��ȥ���յ�������	  �����жϱ�־λ	
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
		RI = 0;			   //��������жϱ�־λ
	}
}
