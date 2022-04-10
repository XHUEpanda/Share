#include "adc.h"

sbit ADC_CS=P2^2;
sbit ADC_RD=P2^3;
sbit ADC_WR=P2^4;
sbit ADC_INTR=P2^5;

int MapAng[5]={6279,10968,15624,20244,24804};

void InitADC(void){
	ADC_CS=0;
	ADC_RD=1;
	ADC_WR=1;//������оƬ�ɼ�
}

//��ȡ��������ѹ�����mv
int GetADC(void){
	int v;
	ADC_WR=0;//������ѹ�ɼ�
	_nop_();
	ADC_WR=1;//������ѹת��
	while(ADC_INTR); //��ѹת����ɺ�INTR=0
	ADC_RD=0;
	v=P1;//��ȡ��ѹ����
	ADC_RD=1;
	return (int)(v*19.607);
}

//����ǵ�ǰ�Ƹ˳��ȵ�λ10^-2mm
int GetLen(void){
	int v;
	v=GetADC();
	v=(int)((25000.0)*(v-VOTL)/(VOTH-VOTL));
	return v;
}

//�õ�Ŀ��ĳ��� ang:�� 
int GetObjLen(int ang){
	if(ang<3) return 0;
	if(ang<5) return MapAng[0];
	if(ang<8) return MapAng[1];
	if(ang<11) return MapAng[2];
	if(ang<14) return MapAng[3];
	if(ang<17) return MapAng[4];
	return 0;
}
