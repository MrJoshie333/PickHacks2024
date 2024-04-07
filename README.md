# PickHacks2024
## Examples of Ciphertext(s):

**Caesar Cipher:** Vsfs ofs gcas zcjszm kcfrg tcf mci hc fsor!

**Atbash Cipher:** Z kiltizn rh mvevi ovhh gszm 90% xlnkovgv, zmw mvevi nliv gszm 95% xlnkovgv.

**Rail Fence Cipher:** M·me!iiSoeh·ssr&H·tMrsuT·o·ieo,fn

**Affine Cipher:** Jppzishwb oz jqq nwzxw qjxl zy juhjohzw, oev mvv lezrqsw'o mv jmqv oz yqd.

**Base64 Encoding:** U2ltcGxpY2l0eSwgY2FycmllZCB0byB0aGUgZXh0cmVtZSwgYmVjb21lcyBlbGVnYW5jZS4=

**Binary Encoding:** 01001000 01100101 01101100 01101100 01101111 00101100 00100000 01010111 01101111 01110010 01101100 01100100 00100001

**Hexadecimal Encoding:** 57 6F 75 6C 64 20 79 6F 75 20 6C 69 6B 65 20 61 20 6A 65 6C 6C 79 20 62 61 62 79 3F

**Morse Code:** .. / -.-. .- -. .----. - / .-- .- .. - / ..-. --- .-. / .--. .. -.-. -.- .... .- -.-. -.- ... / -. . -..- - / -.-- . .- .-. -.-.--



## What's an English Score?

Our extension uses a somewhat complicated method of "ranking" potential plain-text results with an "English Score".
To start, we use a table of English character frequencies, with a more similar pattern resulting in a lower score (low is good).
Then, we compiled a list of the 500 most common English words (which we could expand in future), allowing us to recognize shorter
cipher texts as long as they contain some recognizeable words. The number you see on the screen is a culmination of those factors,
alongside some other back-end checks, and you get an "English Score"! 
