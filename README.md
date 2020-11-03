# iMemgame

<https://github.com/aidatorajiro/MemgameJS> for iPhone.

![screen shot](sukusho.PNG "スクショ")

## How to run (non-jailbroken version)

1. Install Xcode on your PC.
2. Clone or download this project.
3. Run in Terminal: `sudo gem install cocoapods` or `brew install cocoapods`
4. `cd [ clone directory ]`
5. `npm install` (In you don't have node.js, install it first.)
6. Open ios/memgame.xcworkspace (white one, not blue one).
7. Click blue icon named "memgame" at left menubar.
8. Click "memgame" under "TARGETS".
9. Go to "Signing & Capabilities" and set "Team".
10. Run with Command + R.

## How to run (jailbroken version)

1. Install Xcode on your PC.
2. Copy /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/SDKSettings.plist to Desktop
3. Open copied SDKSettings.plist
4. Set DefaultProperties > ENTITLEMENTS_REQUIRED to NO.
5. Set DefaultProperties > CODE_SIGNING_REQUIRED to NO.
6. Save SDKSettings.plist
7. Overwrite /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/SDKSettings.plist with edited SDKSettings.plist (you will need computer password)
8. Clone or download this project.
9. `cd [ clone directory ]`
10. `sudo gem install cocoapods` or `brew install cocoapods`
11. `npm install` (If you don't have node.js, install it first.)
12. Open ios/memgame.xcworkspace (white one, not blue one).
13. Build with Command + B.
14. Jailbreak your iPhone and install OpenSSH. Please set the root password for security.
15. Run this command in Terminal: `scp -r /Users/[ your computer username here ]/Library/Developer/Xcode/DerivedData/memgame-*/Build/Products/Debug-iphoneos/memgame.app root@[ your phone IP address here ]:/Applications/memgame.app`
16. Enter phone root password.
17. `scp -r [ path to clone directory ]/ent.xml root@[ your phone IP address here ]:/Applications/memgame.app`
18. Enter phone root password.
19. `ssh root@[ your phone IP address here ]`
20. Enter phone root password.
21. `cd /Applications/memgame.app`
22. `ldid -Sent.xml memgame`
23. `uicache`
24. `exit`
25. Connect your PC and phone in same Wi-fi network.

Then "memgame" icon will appear in your phone. Tap it to play!


# Libraries
This software uses a framework called React Native (Copyright (c) Facebook, Inc. and its affiliates)

