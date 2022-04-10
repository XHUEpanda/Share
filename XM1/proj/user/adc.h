#ifndef __ADC_H_
#define __ADC_H_
#include <reg52.h>
#include <intrins.h>
#define VOTH 4000 //250mm的电压
#define VOTL 10 //0mm的电压
void InitADC(void);
int GetADC(void);
int GetLen(void);
int GetObjLen(int ang);

#endif
