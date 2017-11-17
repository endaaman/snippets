#!/bin/bash

# 使い方は
# $ bash test.sh 06
# と実行すると 05 の最後のタンプである 05_30.sql を読み込んで 06 を実行できる

cd /var/www/html/

arg1=$1
arg1="${arg1#0}"
scenario_num=`printf "%02d\n" $arg1`

scenario=''
prev_scenario=''
regexp="^tests/acceptance/${scenario_num}_[a-zA-Z]+$"
for cur in `find tests/acceptance -maxdepth 1 -type d | sort`; do
  if [[ $cur =~ $regexp ]]; then
    scenario=$cur
    prev_scenario=$prev
    break
  fi
  prev=$cur
done

if [ -z $scenario ]; then
  echo -e "Scenario number: \e[34m${scenario_num}\e[m does not exist"
  exit
fi

loaddump_command=''
if [[ ! -z $prev_scenario ]] && [[ $prev_scenario =~ ^tests\/acceptance\/([0-9]+)_[a-zA-Z]+$ ]]; then
  dump_num=${BASH_REMATCH[1]}
  dump=`find tests/_output -maxdepth 1 -type f -regex "tests/_output/${dump_num}_[0-9]+.sql" | sort | tail -1`
  if [ ! -z $dump ]; then
    loaddump_command="mysql -uroot shukeen_loc < ${dump} && "
  fi
fi

command="${loaddump_command}./vendor/bin/codecept run ${scenario} -f"

echo 'Now running the following command...'
echo
echo -e "\t\e[34m${command}\e[m"
echo
read -p 'OK to excute? [Y/n] ' -n 1 -r
echo
if [[ ! $REPLY =~ ^[Y]$ ]]; then
  echo 'Aborted.'
  exit
fi

eval $command
