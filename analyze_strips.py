# Analyze M138 strips for completeness and duplicates

# Copy the M138_STRIPS data from script.js
M138_STRIPS = {
    1: "AEJNRUYDHMPTVXZBCFGKLOQISW",
    2: "BFLPSVZCEIMQTWYADGJKNORUXH",
    3: "CGMQUWADFJNRUXYBEHKLPSTVZO",
    4: "DHNRVXBEGKOSWZCFIMLPQTUYA",
    5: "EIORWYCFHLPTXADIGJMQNRUVZB",
    6: "FJPSXZDGIMQUYBEHKNORTVACLW",
    7: "GKQTYADHJNRVZCFILMPSUXBEO",
    8: "HLRUZBEIKOSWADGJNQTVXCFPM",
    9: "IMSVACFJLPXBEHNORTWYDGKQU",
    10: "JNTWBDGKQYZCFILORUVXAEHM",
    11: "KOUXCEHLRYZADJMPRWXBFINS",
    12: "LPVYDFIMSAEBGKNQRUZCHJOT",
    13: "MQWZEGJNTBCFHLORSXADIKPU",
    14: "NRXAFHJOUCEHILMPTVYBGKQZ",
    15: "OSYBGIKVPDFIJMNQUWACHLRZ",
    16: "PTZACHJLWQEGIJNORXBDKMSU",
    17: "QUABDIKLXRFHJMOPSYCENRTV",
    18: "RVBCEJLMYSGIKNOQTZADGPUW",
    19: "SWCDAFKMNZTHIJLPRUBEGOQX",
    20: "TXDEBGLNOAUIJKMQSVZCFHPR",
    21: "UYEFCHMNPBVJKLMRTXADGIOQ",
    22: "VZFGDINOQCWKLMNSUYBEHJO",
    23: "WAGHEJOPRDHKLNOTVZCFIMQ",
    24: "XBHIFKPQSEILMOPUWADGJNR",
    25: "ZCIJGLQRTFJMNPQVXBEHLKN",
    26: "ADJKHMRSUGNOOPRWZCEIML",
    27: "BEKLINSTHPPRQSYADFJKNO",
    28: "CFLMJOTVIQQSRTZBEGLKMP",
    29: "DGNMKPUWIJRRTUBCFHLNMQ",
    30: "EHONLQVXAJTSVWCDHIMONR",
    31: "FIPOMRWYBKUTVHDEJINORT",
    32: "GJQPNSZCLVUXIEGKJMPSUX",
    33: "HKRQOTADMNVWJFHLNQTUVY",
    34: "ILSRPUBENHWYKEIMPSVWZB",
    35: "JMTSTQVCFOIXZLFJNRWXAC",
    36: "KNUUTRWDHPJYAMGKPQSYBE",
    37: "LOVVUSXEIQKABNHLQRTZCCF",
    38: "MPWWVTYFFJRLBCOIMRSAUZDG",
    39: "NQXXWUZGGKSMACPJNSBTVAEH",
    40: "ORYXVAHHLTNBQDQKOTVWBEFI",
    41: "PSZYXBIIMYUHOCROILMPXZFA",
    42: "QTAZYVCJJNZVIPEDSJMNQYAGB",
    43: "RUBAZWDKKOAWJQIFETKNOQZBHC",
    44: "SVCBAXELLPBXKRJGFULORXACID",
    45: "TWDCBYHMMMCYZLSKHGVNPSYBDJE",
    46: "UXEDCZINNDZMATLIGWOQUZEFK",
    47: "VYFEDAJOOEANBUMIIHXQPRVAGG",
    48: "WZGFEBKPPECVNJJZQRBWTBI",
    49: "XAHGFCLQQGFDDWOUKKLARVXUCJ",
    50: "YBIHGDMNRRHGGEXPVLLBSWYDK",
    51: "ZCIJHEONSSIFFYYQWMNCTXZAEL",
    52: "ADKLKJGPPQUTJGHRZXNOUDYBM",
    53: "BELMMLQRQVUKHIIAYOPVEZCN",
    54: "CFMNMRSRSWVLIJJBZPQWFADO",
    55: "DGNONSTSTXMLKKCAQRXGBEP",
    56: "EHOPPUTUUYNNMLDBRSYHCFQ",
    57: "FJPQQVUVVZOONMECTZIDGR",
    58: "GKQRRWVWWAOPQNFDUAJKHS",
    59: "HLRSSXWXXBQRPPOGVBKLIT",
    60: "IMSTTXYYCRSQQHLWCMJU",
    61: "JNTUUYZZDSTRRIMXDNKV",
    62: "KOVVZAAEUTTSJJNYEOLW",
    63: "LPWWABBFVUUTKKOQZGPMX",
    64: "MQXXBCCGWUVULLPRAHQNY",
    65: "NRYYCDDHXWWMMQSBIRO",
    66: "OSZZDEEIYYXNNRTTCJSP",
    67: "PTAAEFFZZZYYOOSUUDKQ",
    68: "QUBBFFGAAAZZPPTVVEMR",
    69: "RVCCGGBBBAQQWWFNSS",
    70: "SWDDHICCBBRRXXGOUTT",
    71: "TXEEJJDDCCSSYYHPVVU",
    72: "UYFFKKEEDDTTZZIQWWV",
    73: "VZGGLMFFEEUUAAJRRXW",
    74: "WAHHMMGGGFVVBBKSSYX",
    75: "XBIINNIHHGGWWCLTTYY",
    76: "ZCJJOOKJIHHXXDMUUZZ",
    77: "ADKKPLLKJIIYYYENNVA",
    78: "BELMMMNLKJJJAZFOOWB",
    79: "CFMNNNOMMMKBAAGPPXC",
    80: "DGNOOOPNNOLLCBHHQYD",
    81: "EHPPPQQPPNNMDDDIRZZE",
    82: "FIQQQRRQOOOEEEEJSAAF",
    83: "GKRRRSSRRPPFFFFKTBBG",
    84: "HLSSSTSSQQGGGGLUUCH",
    85: "IMTTTUUTTRRHHHMVVDI",
    86: "JNUUUVVUUSSIIJNWEJ",
    87: "KOVVVWWVVTJJJKOXXF",
    88: "LPWWWXXXWUKKKLPZYG",
    89: "MQXXXXXYVLLMMQAZH",
    90: "NRYYYYZWMMNNNRBBAI",
    91: "OSZZZZAXNNNOOOSCCBJ",
    92: "PTAAAABYYYYPPPTDDCK",
    93: "QUBBBBBCZZAQQQUVEEL",
    94: "RVCCCCCDAABBRRWFFM",
    95: "SWDDDDEEABBCSSSXGGN",
    96: "TXEEEEEFCCDDDTTTYYHO",
    97: "UYFFFFFFFDDEEEUUUZZIP",
    98: "VZGGGGGGEEFFFFFVVAAJQ",
    99: "WAHHHHHHGFGGGGWWWBBKR",
    100: "XBIIIIIIHHHHHXXXCCCMLS"
}

# Analyze each strip
results = []
alphabet = set('ABCDEFGHIJKLMNOPQRSTUVWXYZ')

for strip_num, strip in M138_STRIPS.items():
    # Check length
    length = len(strip)
    
    # Check for unique characters
    unique_chars = set(strip)
    num_unique = len(unique_chars)
    
    # Check for missing letters
    missing_letters = alphabet - unique_chars
    
    # Check for duplicate letters
    char_counts = {}
    for char in strip:
        char_counts[char] = char_counts.get(char, 0) + 1
    duplicates = {char: count for char, count in char_counts.items() if count > 1}
    
    # Determine if it's a valid strip (26 unique letters)
    is_valid = length == 26 and num_unique == 26 and len(missing_letters) == 0
    
    results.append({
        'strip': strip_num,
        'length': length,
        'unique_chars': num_unique,
        'missing_letters': missing_letters,
        'duplicates': duplicates,
        'is_valid': is_valid
    })

# Display summary
valid_strips = [r for r in results if r['is_valid']]
invalid_strips = [r for r in results if not r['is_valid']]

print(f"Total strips analyzed: {len(results)}")
print(f"Valid strips (26 unique letters A-Z): {len(valid_strips)}")
print(f"Invalid strips: {len(invalid_strips)}")
print("\n" + "="*60 + "\n")

# Show which strips are valid
print("VALID STRIPS (1-25):")
print("-"*60)
for i in range(1, 26):
    result = next(r for r in results if r['strip'] == i)
    if result['is_valid']:
        print(f"Strip {i}: ✓ Valid - All 26 letters, no duplicates")
    else:
        print(f"Strip {i}: ✗ Invalid")

print("\n" + "="*60 + "\n")

# Show details of invalid strips
if invalid_strips:
    print("INVALID STRIPS DETAILS:")
    print("-"*60)
    for result in invalid_strips:
        print(f"\nStrip {result['strip']}:")
        print(f"  String: {M138_STRIPS[result['strip']]}")
        print(f"  Length: {result['length']} (expected: 26)")
        print(f"  Unique characters: {result['unique_chars']}")
        if result['missing_letters']:
            print(f"  Missing letters: {', '.join(sorted(result['missing_letters']))}")
        if result['duplicates']:
            dup_str = ", ".join([f"{char}:{count}" for char, count in sorted(result['duplicates'].items())])
            print(f"  Duplicate letters: {dup_str}")