import { createBook } from './createBook.js'

export default createBook(
  {
    id: 'happy-prince',
    title: '快乐王子与其他故事',
    subtitle: '在温柔童话里读懂给予与爱',
    author: '奥斯卡·王尔德 原作',
    level: '四级精读',
    description: '根据公版英文原作进行原创中文学习改写，以细腻童话串联情感与社会主题词汇。',
    accent: '#9FC4E2',
    coverMark: '星'
  },
  [
    {
      title: '第01章 王子第一次流泪',
      summary: '高塔上的王子看见城市苦难，请燕子替他送出宝石。',
      content: `城市中央立着一尊高大的【statue】，人们称它为快乐王子。雕像全身【gilded】，双眼嵌着蓝色【sapphire】，剑柄上还有一颗红【ruby】。一只准备向南方【migrate】的【swallow】飞来，在王子脚边寻找过夜的【shelter】。

夜里，燕子被水滴惊醒，才发现王子正在哭。王子站得很高，第一次看见城市里的【sorrow】与【poverty】。他请燕子做自己的【messenger】，把红宝石送给远处生病孩子的母亲。燕子原本急着赶路，却答应为他停留一【night】。

这份【sacrifice】让寒风中的燕子感到温暖。它把宝石【deliver】到破旧窗前，孩子的母亲虽然不知道礼物从何而来，却充满【grateful】。燕子回到王子身边，终于理解真正的【compassion】不是远远叹息，而是愿意替别人行动。`,
      vocabulary: [
        ['statue', '/ˈstætʃuː/', 'n.', '雕像'],
        ['gilded', '/ˈɡɪldɪd/', 'adj.', '镀金的'],
        ['sapphire', '/ˈsæfaɪə(r)/', 'n.', '蓝宝石'],
        ['ruby', '/ˈruːbi/', 'n.', '红宝石'],
        ['migrate', '/maɪˈɡreɪt/', 'v.', '迁徙'],
        ['swallow', '/ˈswɒləʊ/', 'n.', '燕子'],
        ['shelter', '/ˈʃeltə(r)/', 'n.', '庇护处'],
        ['sorrow', '/ˈsɒrəʊ/', 'n.', '悲伤'],
        ['poverty', '/ˈpɒvəti/', 'n.', '贫困'],
        ['messenger', '/ˈmesɪndʒə(r)/', 'n.', '信使'],
        ['night', '/naɪt/', 'n.', '夜晚'],
        ['sacrifice', '/ˈsækrɪfaɪs/', 'n.', '牺牲；奉献'],
        ['deliver', '/dɪˈlɪvə(r)/', 'v.', '递送'],
        ['grateful', '/ˈɡreɪtfl/', 'adj.', '感激的'],
        ['compassion', '/kəmˈpæʃn/', 'n.', '同情；怜悯']
      ]
    },
    {
      title: '第02章 把光送进寒夜',
      summary: '燕子一次次推迟远行，把王子的宝石和金叶送给困苦的人。',
      content: `第二晚，王子看见一位疲惫的【seamstress】。她忙着刺绣，身旁的孩子却因【fever】口渴哭泣。王子让燕子取下自己的一只眼睛送去。另一边，阁楼里的年轻【playwright】在寒冷的【attic】写不下去，因为【hunger】让他的手不停发抖。

燕子把第二颗宝石送给他，又在广场遇到卖【match】的小女孩。火柴掉进水沟，害怕挨骂的【child】不敢回家。王子最后一只【jewel】也被送走，从此再也看不见。燕子决定成为他的眼睛，用自己的【wing】飞遍城市，再把见闻讲给他听。

天气越来越冷，【frost】爬上屋顶。王子把身上的金叶一片片送给穷人，这份【kindness】也成为燕子甘愿承担的【burden】。烟从【chimney】升起，孩子们终于有了面包；当清晨【dawn】照亮【square】，灰暗城市里多出了一点温暖。`,
      vocabulary: [
        ['seamstress', '/ˈsiːmstrəs/', 'n.', '女裁缝'],
        ['fever', '/ˈfiːvə(r)/', 'n.', '发烧'],
        ['playwright', '/ˈpleɪraɪt/', 'n.', '剧作家'],
        ['attic', '/ˈætɪk/', 'n.', '阁楼'],
        ['hunger', '/ˈhʌŋɡə(r)/', 'n.', '饥饿'],
        ['match', '/mætʃ/', 'n.', '火柴'],
        ['child', '/tʃaɪld/', 'n.', '孩子'],
        ['jewel', '/ˈdʒuːəl/', 'n.', '宝石'],
        ['wing', '/wɪŋ/', 'n.', '翅膀'],
        ['frost', '/frɒst/', 'n.', '霜；严寒'],
        ['kindness', '/ˈkaɪndnəs/', 'n.', '善良'],
        ['burden', '/ˈbɜːdn/', 'n.', '负担'],
        ['chimney', '/ˈtʃɪmni/', 'n.', '烟囱'],
        ['dawn', '/dɔːn/', 'n.', '黎明'],
        ['square', '/skweə(r)/', 'n.', '广场']
      ]
    },
    {
      title: '第03章 城里最珍贵的东西',
      summary: '冬雪降临，失去光彩的王子与燕子留下无人能熔化的爱。',
      content: `严冬来临，燕子知道自己的生命将尽，却不肯离开王子。它最后亲吻王子，跌落在雕像脚边。王子的铅【heart】随即裂成两半。第二天，【mayor】和【council】经过，嫌雕像太【shabby】，决定把它拆下送进【furnace】。

工人熔化了表面的金属，却发现那颗【lead】心怎么也不融，便把它和燕子一起当作【refuse】丢弃。可在无人注意的角落，它们代表的【generosity】从未消失。一个【angel】来到城市，要寻找两件最【precious】的东西，于是带走了破碎的心与小燕子。

故事没有把荣耀留给富丽的外表，而把【paradise】送给两个愿意付出的灵魂。人们或许会忘记雕像曾经多么耀眼，但孩子们的【memory】里仍有那些被帮助的清晨。真正【eternal】的价值往往十分【humble】，它不要求掌声，只让【love】继续在人与人之间传递。`,
      vocabulary: [
        ['heart', '/hɑːt/', 'n.', '心；心脏'],
        ['mayor', '/meə(r)/', 'n.', '市长'],
        ['council', '/ˈkaʊnsl/', 'n.', '议会'],
        ['shabby', '/ˈʃæbi/', 'adj.', '破旧的'],
        ['furnace', '/ˈfɜːnɪs/', 'n.', '熔炉'],
        ['lead', '/led/', 'n.', '铅'],
        ['refuse', '/ˈrefjuːs/', 'n.', '废物；垃圾'],
        ['generosity', '/ˌdʒenəˈrɒsəti/', 'n.', '慷慨'],
        ['angel', '/ˈeɪndʒl/', 'n.', '天使'],
        ['precious', '/ˈpreʃəs/', 'adj.', '珍贵的'],
        ['paradise', '/ˈpærədaɪs/', 'n.', '天堂；乐园'],
        ['memory', '/ˈmeməri/', 'n.', '记忆'],
        ['eternal', '/ɪˈtɜːnl/', 'adj.', '永恒的'],
        ['humble', '/ˈhʌmbl/', 'adj.', '谦逊的；不起眼的'],
        ['love', '/lʌv/', 'n.', '爱']
      ]
    }
  ]
)
