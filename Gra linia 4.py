import re
p='android/app/src/main/AndroidManifest.xml'
s=open(p,encoding='utf-8').read()
perms=['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION','FOREGROUND_SERVICE','FOREGROUND_SERVICE_LOCATION','POST_NOTIFICATIONS','WAKE_LOCK','INTERNET']
add=''.join('    <uses-permission android:name="android.permission.%s" />\n'%x for x in perms if 'android.permission.%s"'%x not in s)
s=s.replace('</manifest>',add+'</manifest>')
open(p,'w',encoding='utf-8').write(s)
print('manifest ok')
