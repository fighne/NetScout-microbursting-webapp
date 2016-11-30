#!/bin/bash


if [ -z "$QUERY_STRING" ]; then
	echo 'Content-type: text/plain'
	echo
	echo "Usage: run.sh?probe=[3456]&time=[utc_time]"
	exit 
fi

# Save the old internal field seperator
OIFS="$IFS"

# Set the field seperator to & and parse the QUERY_STRING at the ampersand
IFS="${IFS}&"
set $QUERY_STRING
Args="$*"
IFS="$OIFS"

# Next parse the individual "name=value" tokens

for i in $Args ;do
# Set the field seperator to = 
#IFS="${OIFS}="
#set $i
#IFS="${OIFS}"
	[ `echo $i | grep '^probe='` ] && probe=`echo $i | cut -f2 -d'='`
	[ `echo $i | grep '^time='` ] && time=`echo $i | cut -f2 -d'='`
	[ `echo $i | grep '^gran='` ] && gran=`echo $i | cut -f2 -d'='`
done

ip=`/sbin/ifconfig eth0 | grep 'inet addr' | cut -f2 -d':' | cut -f1 -d' '`
user="administrator"
pass="netscout1"
ifn=$probe

if [ "$gran" == "Seconds" ];then
	delta=1000
elif [ "$gran" == "Milliseconds"];then
	delta=1
else
	delta=0
fi

start=$(( $time - $delta ))
end=$(( $time + $delta))
filename="/opt/datamole/input."$$

/opt/NetScout/rtm/tools/exportcli -u $user -p $pass $filename $ip $ifn $start $end >/tmp/output_1.txt 2>/tmp/output_2.txt

#if [ -e /opt/datamole/input.$$.pcap ]; then
#	export LD_LIBRARY_PATH=/opt/datamole
#	sed "s#PID#$$#" /opt/datamole/interfaces.xml_ > /opt/datamole/interfaces.xml
#	sed "s#PID#$$#" /opt/datamole/outputs.xml_ > /opt/datamole/outputs.xml
#	sed "s#GRAN#$$#" /opt/datamole/outputs.xml_ > /opt/datamole/outputs.xml
#	/opt/datamole/datamole -c /opt/datamole ngenius >/dev/null 2>/dev/null
#	[ -e /opt/datamole/output.$$.txt ] && mv -f /opt/datamole/output.$$.txt /var/www/thttpd/html/static/output.txt
#	rm -f /opt/datamole/input.$$.pcap
#fi

echo 'Content-type: text/plain'
echo
echo 'Success!'
#echo $oStr
#echo $ip
#echo $user
#echo $pass
#echo $ifn
#echo $start
#echo $end
#echo $$
#echo $filename

