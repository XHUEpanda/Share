#include "motor.h"

sbit M1=P2^0;
sbit M2=P2^1;

void InitMotor(void){
	M1=0;
	M2=0;
}

void MoveP(int time){
	int i=0;
	for(;i<time;i++){
		M1=1;
	}
	M1=0;
}

void MoveN(int time){
	int i=0;
	for(;i<time;i++){
		M2=1;
	}
	M2=0;
}

//PIDµ÷½ÚÆ÷
int PIDMotor(int err){
	static int eI;
	static double elast;
	int out=AP*err+AI*eI+AD*elast/err;
	eI=eI+err;
	elast=err;
	return out;
}	
	
