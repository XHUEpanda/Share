#ifndef __MOTOR_H_
#define __MOTOR_H_
#include <reg52.h>
#define AP 1.0
#define AI 0.2
#define AD 0.01
void InitMotor(void);
void MoveP(int time);
void MoveN(int time);
int PIDMotor(int err);

#endif
