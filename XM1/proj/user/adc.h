#ifndef __ADC_H_
#define __ADC_H_
#include <reg52.h>
#include <intrins.h>
#define VOTH 4000 //250mm�ĵ�ѹ
#define VOTL 10 //0mm�ĵ�ѹ
void InitADC(void);
int GetADC(void);
int GetLen(void);
int GetObjLen(int ang);

#endif
