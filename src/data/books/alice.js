import { createBook } from './createBook.js'

export default createBook(
  {
    id: 'alice',
    title: '爱丽丝梦游仙境',
    subtitle: '跟着好奇心跌进奇妙世界',
    author: '刘易斯·卡罗尔 原作',
    level: '四级进阶',
    description: '根据公版英文原作进行原创中文学习改写，用荒诞冒险串联常用四级词汇。',
    accent: '#B7DCC7',
    coverMark: '兔'
  },
  [
    {
      title: '第01章 掉进兔子洞',
      summary: '爱丽丝追赶白兔，从平静河岸坠入未知世界。',
      content: `午后的河岸安静得让人犯困。爱丽丝本来只是有些【curious】，直到一只穿着【waistcoat】的白兔从草丛里跑过，还从【pocket】里掏出怀表。它一边说要迟到了，一边钻进一个漆黑的【tunnel】。爱丽丝来不及多想，便追了进去，心里只剩一个念头：这件事一定藏着某种【wonder】。

地面【suddenly】消失，她开始向下【fall】。兔子洞像一条没有尽头的【passage】，四周的【shelf】上摆着地图、书本和一只空【jar】。她下落了很久，忍不住猜测自己离地面已有多远的【distance】，甚至怀疑这一切只是一场【dream】。

终于，她落在一堆枯叶上。远处又传来白兔焦急的脚步声，她赶紧【hurry】着追过去。面前是一扇扇紧闭的小门，而桌上那把【key】显得格外【remarkable】。普通的一天，就这样被一道小门彻底改写。`,
      vocabulary: [
        ['curious', '/ˈkjʊəriəs/', 'adj.', '好奇的'],
        ['waistcoat', '/ˈweɪskəʊt/', 'n.', '背心；马甲'],
        ['pocket', '/ˈpɒkɪt/', 'n.', '口袋'],
        ['tunnel', '/ˈtʌnl/', 'n.', '隧道'],
        ['wonder', '/ˈwʌndə(r)/', 'n.', '惊奇；奇观'],
        ['suddenly', '/ˈsʌdənli/', 'adv.', '突然地'],
        ['fall', '/fɔːl/', 'v.', '落下；跌落'],
        ['passage', '/ˈpæsɪdʒ/', 'n.', '通道；段落'],
        ['shelf', '/ʃelf/', 'n.', '架子'],
        ['jar', '/dʒɑː(r)/', 'n.', '罐子'],
        ['distance', '/ˈdɪstəns/', 'n.', '距离'],
        ['dream', '/driːm/', 'n.', '梦'],
        ['hurry', '/ˈhʌri/', 'v.', '匆忙；赶紧'],
        ['remarkable', '/rɪˈmɑːkəbl/', 'adj.', '非凡的；引人注目的'],
        ['key', '/kiː/', 'n.', '钥匙']
      ].map((item) => item[0] === 'key'
        ? [...item, 'The tiny key opened a hidden door.', '桌上的【key】只能打开帘幕后那扇小门。']
        : item),
      // key 的正文标记放在末句，便于词卡定位。
    },
    {
      title: '第02章 眼泪池塘',
      summary: '身体忽大忽小，爱丽丝在眼泪里遇见一群新伙伴。',
      content: `爱丽丝喝下瓶里的液体后，身体像一架收起的【telescope】那样迅速【shrink】。她拿到了钥匙，却发现钥匙又从桌面【vanish】。白兔慌忙经过，掉下一把【fan】和一只白色【glove】；爱丽丝刚把扇子握在手里，身体又发生了变化。

委屈和害怕一起涌上来，她的【tears】越流越多，竟汇成一片【pool】。当她变小时，整个人跌进水里，只能努力向【shore】游去。水面上出现一只【mouse】，爱丽丝想与它交谈，却因为提到猫而无意【offend】了它。

这场【conversation】并不顺利。爱丽丝觉得自己格外【lonely】，周围每件事都如此【strange】。后来，更多鸟兽掉进池塘，大家一起【swim】，总算从眼泪里【escape】出来。她开始明白，在这个世界里，说话和行动都要比平时更谨慎。`,
      vocabulary: [
        ['telescope', '/ˈtelɪskəʊp/', 'n.', '望远镜'],
        ['shrink', '/ʃrɪŋk/', 'v.', '缩小；收缩'],
        ['vanish', '/ˈvænɪʃ/', 'v.', '消失'],
        ['fan', '/fæn/', 'n.', '扇子'],
        ['glove', '/ɡlʌv/', 'n.', '手套'],
        ['tears', '/tɪəz/', 'n.', '眼泪'],
        ['pool', '/puːl/', 'n.', '水池'],
        ['shore', '/ʃɔː(r)/', 'n.', '岸边'],
        ['mouse', '/maʊs/', 'n.', '老鼠'],
        ['offend', '/əˈfend/', 'v.', '冒犯'],
        ['conversation', '/ˌkɒnvəˈseɪʃn/', 'n.', '交谈'],
        ['lonely', '/ˈləʊnli/', 'adj.', '孤独的'],
        ['strange', '/streɪndʒ/', 'adj.', '奇怪的'],
        ['swim', '/swɪm/', 'v.', '游泳'],
        ['escape', '/ɪˈskeɪp/', 'v.', '逃离']
      ]
    },
    {
      title: '第03章 一场没有终点的比赛',
      summary: '湿漉漉的伙伴们举办怪比赛，规则比结果更离奇。',
      content: `岸上挤满了湿漉漉的【creature】，场面十分【crowded】。大家争论怎样把衣服弄干，一只渡渡鸟提议举行一场【race】。它让所有人围成一个【circle】，却不解释起点和终点，弄得爱丽丝十分【confuse】。

哨声一响，众人各自奔跑；有人停下，有人倒着走。等大家差不多变【dry】，渡渡鸟便郑重【announce】比赛结束，并说每个人都赢了。至于【prize】，它要求爱丽丝拿出一枚【thimble】，再以十分【solemn】的仪式把它颁回给她。

老鼠随后讲起自己的长【tale】，可爱丽丝总把“尾巴”和“故事”混在一起。争论像一场小型【trial】，谁也不肯先让步。老鼠气得【disappear】，爱丽丝也因自己的坏【temper】感到后悔。她望着树林深处，意识到真正的【adventure】才刚刚开始。`,
      vocabulary: [
        ['creature', '/ˈkriːtʃə(r)/', 'n.', '生物；动物'],
        ['crowded', '/ˈkraʊdɪd/', 'adj.', '拥挤的'],
        ['race', '/reɪs/', 'n.', '比赛'],
        ['circle', '/ˈsɜːkl/', 'n.', '圆圈'],
        ['confuse', '/kənˈfjuːz/', 'v.', '使困惑'],
        ['dry', '/draɪ/', 'adj.', '干燥的'],
        ['announce', '/əˈnaʊns/', 'v.', '宣布'],
        ['prize', '/praɪz/', 'n.', '奖品'],
        ['thimble', '/ˈθɪmbl/', 'n.', '顶针'],
        ['solemn', '/ˈsɒləm/', 'adj.', '庄严的'],
        ['tale', '/teɪl/', 'n.', '故事'],
        ['trial', '/ˈtraɪəl/', 'n.', '审判；试验'],
        ['disappear', '/ˌdɪsəˈpɪə(r)/', 'v.', '消失'],
        ['temper', '/ˈtempə(r)/', 'n.', '脾气'],
        ['adventure', '/ədˈventʃə(r)/', 'n.', '冒险']
      ]
    }
  ]
)
