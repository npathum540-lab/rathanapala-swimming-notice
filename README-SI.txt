සපුගොඩ ශ්‍රී රතනපාල විද්‍යාලය - Notice Board පමණක් යාවත්කාලීන කිරීම

ගොනු:
- index.html: දැනට තිබූ ප්‍රධාන වෙබ් අඩවිය. Notice Board එකට පමණක් API සම්බන්ධතාවය එකතු කර ඇත.
- admin.html: Notice Board Admin Login සහ පණිවිඩය Update කිරීම.
- netlify/functions/: ආරක්ෂිත server-side login සහ Notice API.
- netlify.toml, package.json: Netlify deploy සැකසුම්.

වැදගත් ආරක්ෂක කරුණු:
1. ADMIN_PASSWORD සහ ADMIN_SESSION_SECRET කිසිවිටෙක HTML/JavaScript ගොනුවක හෝ GitHub repository එකේ ලියන්න එපා.
2. Netlify Dashboard > Site configuration > Environment variables තුළ ADMIN_PASSWORD සහ ADMIN_SESSION_SECRET එකතු කරන්න.
3. ADMIN_PASSWORD සඳහා දිගු, අනුමාන කිරීමට අපහසු, වෙනත් තැනක භාවිතා නොකරන password එකක් තෝරන්න (අවම අකුරු 12).
4. ADMIN_SESSION_SECRET සඳහා අහඹු දිගු අගයක් (අවම අකුරු 32) යොදන්න.
5. Variables එකතු කළ පසු නැවත deploy කරන්න.
6. Deploy වූ පසු /admin.html වෙත ගොස් Login වන්න.

මෙම පැකේජය සෘජුවම සජීවී වෙබ් අඩවියට deploy කර නැත. GitHub repository එකට දමා Netlify deploy කළ පසු පමණක් වැඩ කරයි.
