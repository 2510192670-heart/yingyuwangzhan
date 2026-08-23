import { createBook } from './createBook.js'

export default createBook(
  {
    id: 'oz',
    title: '绿野仙踪',
    subtitle: '沿黄砖路寻找勇气、智慧与家',
    author: '莱曼·弗兰克·鲍姆 原作',
    level: '四级进阶',
    description: '根据公版英文原作进行原创中文学习改写，在奇幻旅途中理解友谊与自我成长。',
    accent: '#E6C66A',
    coverMark: '路'
  },
  [
    {
      title: '第01章 龙卷风后的陌生国度',
      summary: '多萝西和小狗托托随房屋飞离堪萨斯，落入奥兹国。',
      content: `堪萨斯的【prairie】辽阔而灰暗。小女孩多萝西是个【orphan】，与叔叔婶婶住在简陋的【farmhouse】里。一天，天空忽然压低，一场巨大的【cyclone】朝他们卷来。大家冲向地下【cellar】，多萝西却为了寻找托托留在屋内。

房子被狂风托起，不停地【whirl】。过了很久，它伴着一声【crash】落到地面，四周随即恢复【silence】。多萝西推开门，看到的却是一个【strange】而明亮的【land】，花朵在阳光下【sparkle】，矮小的人们走来向她【greet】。

一位善良的【witch】告诉她，房子意外压住了东方恶女巫，让当地人重获【freedom】。可多萝西只想回家。女巫建议她去翡翠城寻找奥兹，并提醒这段【journey】不会轻松。多萝西穿上银鞋，抱紧托托，踏出了第一步。`,
      vocabulary: [
        ['prairie', '/ˈpreəri/', 'n.', '大草原'],
        ['orphan', '/ˈɔːfn/', 'n.', '孤儿'],
        ['farmhouse', '/ˈfɑːmhaʊs/', 'n.', '农舍'],
        ['cyclone', '/ˈsaɪkləʊn/', 'n.', '旋风；龙卷风'],
        ['cellar', '/ˈselə(r)/', 'n.', '地窖'],
        ['whirl', '/wɜːl/', 'v.', '旋转'],
        ['crash', '/kræʃ/', 'n.', '撞击声'],
        ['silence', '/ˈsaɪləns/', 'n.', '寂静'],
        ['strange', '/streɪndʒ/', 'adj.', '陌生的；奇怪的'],
        ['land', '/lænd/', 'n.', '土地；国度'],
        ['sparkle', '/ˈspɑːkl/', 'v.', '闪耀'],
        ['greet', '/ɡriːt/', 'v.', '迎接；问候'],
        ['freedom', '/ˈfriːdəm/', 'n.', '自由'],
        ['journey', '/ˈdʒɜːni/', 'n.', '旅程'],
        ['witch', '/wɪtʃ/', 'n.', '女巫', 'A kind witch showed Dorothy the road.', '善良的【witch】为多萝西指明了方向。']
      ],
    },
    {
      title: '第02章 黄砖路上的伙伴',
      summary: '稻草人、铁皮人加入旅途，每个人都向往自己以为缺少的东西。',
      content: `通往【emerald】城的路由黄色【brick】铺成。多萝西在田边遇到一个挂在木【pole】上的【scarecrow】，便把它【rescue】下来。稻草人说自己没有【brain】，所以常被乌鸦嘲笑；他希望奥兹能给他智慧，于是成为多萝西的第一个【companion】。

他们穿过【field】，又听见树林里传来微弱的呼救声。一个铁皮人站在那里，身体被雨水【rust】住。多萝西找到【oil】壶，让他的关节重新活动。铁皮人相信自己缺少【heart】，也想向奥兹求助。

三个旅伴交换各自的【promise】：无论遇到什么，都要【together】前进。稻草人在困难前不断想办法，铁皮人会为受伤的小虫难过，多萝西发现他们也许早已有了智慧与爱。可他们仍需要【courage】，才能共同抵达最终的【destination】。`,
      vocabulary: [
        ['emerald', '/ˈemərəld/', 'n.', '翡翠'],
        ['brick', '/brɪk/', 'n.', '砖'],
        ['pole', '/pəʊl/', 'n.', '杆；柱'],
        ['scarecrow', '/ˈskeəkrəʊ/', 'n.', '稻草人'],
        ['rescue', '/ˈreskjuː/', 'v.', '营救'],
        ['brain', '/breɪn/', 'n.', '大脑；智慧'],
        ['companion', '/kəmˈpæniən/', 'n.', '同伴'],
        ['field', '/fiːld/', 'n.', '田野'],
        ['rust', '/rʌst/', 'v.', '生锈'],
        ['oil', '/ɔɪl/', 'n.', '油'],
        ['heart', '/hɑːt/', 'n.', '心；爱心'],
        ['promise', '/ˈprɒmɪs/', 'n.', '承诺'],
        ['courage', '/ˈkʌrɪdʒ/', 'n.', '勇气'],
        ['destination', '/ˌdestɪˈneɪʃn/', 'n.', '目的地'],
        ['together', '/təˈɡeðə(r)/', 'adv.', '一起', 'They decided to travel together.', '伙伴们决定【together】走完黄砖路。']
      ]
    },
    {
      title: '第03章 会害怕的狮子',
      summary: '胆小狮加入队伍，伙伴们合力穿越森林、河流和罂粟花田。',
      content: `黄砖路伸进黑暗的【forest】，突然，一声【roar】震得托托直发抖。一只看似【fierce】的狮子跳出来，却承认自己其实是个【coward】。他为自己的恐惧感到【ashamed】，又在多萝西遇险时本能地站出来【protect】她。

狮子也加入队伍。前方的【obstacle】是一条宽阔的【river】，大家扎起【raft】渡水，却被急促的【current】冲离黄砖路。稻草人想出办法，狮子跳进水中拖动木筏，铁皮人则稳住每个人。所谓勇敢，并不是从不害怕。

上岸后，他们走进一片红色【poppy】花田。香气让多萝西和托托沉沉【sleep】，狮子也倒下了。稻草人和铁皮人保持清醒，凭着【loyal】的心把朋友一点点【carry】出去。夕阳下，所有人重新看到抵达翡翠城的【hope】。`,
      vocabulary: [
        ['forest', '/ˈfɒrɪst/', 'n.', '森林'],
        ['roar', '/rɔː(r)/', 'n.', '吼声'],
        ['fierce', '/fɪəs/', 'adj.', '凶猛的'],
        ['coward', '/ˈkaʊəd/', 'n.', '胆小鬼'],
        ['ashamed', '/əˈʃeɪmd/', 'adj.', '羞愧的'],
        ['protect', '/prəˈtekt/', 'v.', '保护'],
        ['obstacle', '/ˈɒbstəkl/', 'n.', '障碍'],
        ['river', '/ˈrɪvə(r)/', 'n.', '河流'],
        ['raft', '/rɑːft/', 'n.', '木筏'],
        ['current', '/ˈkʌrənt/', 'n.', '水流'],
        ['poppy', '/ˈpɒpi/', 'n.', '罂粟花'],
        ['sleep', '/sliːp/', 'v.', '睡着'],
        ['loyal', '/ˈlɔɪəl/', 'adj.', '忠诚的'],
        ['carry', '/ˈkæri/', 'v.', '搬运；携带'],
        ['hope', '/həʊp/', 'n.', '希望']
      ]
    }
  ]
)
