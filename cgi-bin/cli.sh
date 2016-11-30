




time=$(date +%s%3N -d "1 second ago")
echo $time
ip=`/sbin/ifconfig eth0 | grep 'inet addr' | cut -f2 -d':' | cut -f1 -d' '`
user="administrator"
pass="netscout1"
ifn=$probe
start=$time
echo $start
delta=1

echo $(( $start + 1 ))
filename=" /opt/datamole/input."$$

/opt/NetScout/rtm/tools/exportcli -u $user -p $pass $filename $ip $ifn $start $end
