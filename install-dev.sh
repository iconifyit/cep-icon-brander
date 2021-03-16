#!/usr/bin/env bash

function mydirname {
  pwd  >/tmp/x
  STR=`cat /tmp/x`
  FN=`awk -F\/ '{print NF}' /tmp/x`
  DIR=$(echo $STR | cut -f$FN -d"/")
  echo $DIR
}

HERE=`pwd`
NAME=`mydirname`

TARGET="/Library/Application Support/Adobe/CEP/extensions/$NAME.dev"

# read -s -p 'Enter Password:' PASSWORD

if [ -d "$TARGET" ]; then
    read -s -p "Are you sure you want to delete $TARGET ? (type yes)" CONFIRM
    if [ "$CONFIRM" != "yes" ] && [ "$CONFIRM" != "YES" ]; then
        echo "" && echo "Exiting without doing anything"
        return
    fi
    echo -e "$PASSWORD\n" | sudo rm -R -f "$TARGET"
    # echo "Faking rm -R -f"
fi

sudo ln -s "$HERE" "$TARGET"