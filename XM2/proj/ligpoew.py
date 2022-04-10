in1=input('多少度电')
kwh=int(in1)
if(kwh<180):
    money=kwh*0.5224
else: 
    if(kwh<280):
        money=180*0.5224+(kwh-180)*0.6224
    else:
        money=180*0.5224+100*0.6224+(kwh-280)*0.8224

print("电费:%d",money)