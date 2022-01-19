// 共享数据

const Store = {
    state: {
        // 钱包地址
        walletAddress: '',
        // 钱包网络id
        walletNetworkId: '',
        // 钱包网络名称
        walletNetworkName: '',
        // 资产列表
        assetsList: [{
            created_at: "2021-08-26T15:12:57+08:00",
            creator: 9,
            enabled: 1,
            icon: "https://wisdchain.com/img/jishu2.png",
            id: 4247282891358568,
            name: "USDT",
            sequence: 0,
            symbol: "USDT",
            updated_at: "2021-08-26T15:12:57+08:00",
        }, {
            created_at: "2021-08-26T15:12:57+08:00",
            creator: 9,
            enabled: 1,
            icon: "https://wisdchain.com/img/jishu2.png",
            id: 4247282891358548,
            name: "USDT2",
            sequence: 0,
            symbol: "USDT",
            updated_at: "2021-08-26T15:12:57+08:00",
        }],
        // 选中的资产s
        actionAssets: {},
        // 网络列表
        networkList: [{
            AddressRegex: "1",
            agent_abi: "[\r\n\t{\r\n\t\t9A25c1290C234182A51F094438E2b",
            already_register: 0,
            asset_id: 1,
            chain_id: 1,
            contract_address: "0xe11108358e0f7AAc5f98B151359301a489f22F33",
            created_at: "2021-11-22T17:04:54.722+08:00",
            creator: 9,
            decimals: 18,
            fee: "1",
            id: 21,
            lock_amount: "",
            max_amount: "100000",
            measure: "",
            min_amount: "0.000000000000000001",
            name: "DOT",
            network_icon: "",
            network_id: 2,
            network_name: "ETH",
            per_address_amount: "",
            register_status: 0,
            register_to_chain_id: 0,
            register_tx_hash: "",
            rpc_url: "https://ropsten.infura.io/v3/ebacd5fd12c448a6a31d9347716e3372",
            scan_url: "ASDF",
            surplus_amount: "",
            symbol: "DOT",
            updated_at: "2021-11-23T13:49:13.796+08:00"
        }, {
            AddressRegex: "1",
            asset_id: 4247282891358568,
            agent_abi: "string",
            agent_address: "0xa3D072A1DD0058C8850D71E2A3f53c2c225bf944",
            contract_address: "0x60F80cB9f5E906B34DB2Cf2c60b206C6866B53C3",
            created_at: "2021-09-06T16:30:28.629+08:00",
            creator: 9,
            decimals: 18,
            fee: "0",
            id: 5849592146952552,
            max_amount: "10000",
            min_amount: "1",
            name: "USDT",
            network_icon: "https://wisdchain.com/img/jishu2.png",
            network_id: 4248807671857512,
            network_name: "PSC",
            per_address_amount: "",
            symbol: "USDT",
            updated_at: "2021-09-06T16:30:28.629+08:00",
        }, {
            AddressRegex: "1",
            asset_id: 4247282891358568,
            agent_abi: "string",
            agent_address: "0xa3D072A1DD0058C8850D71E2A3f53c2c225bf944",
            contract_address: "0x60F80cB9f5E906B34DB2Cf2c60b206C6866B53C3",
            created_at: "2021-09-06T16:30:28.629+08:00",
            creator: 9,
            decimals: 18,
            fee: "0",
            id: 5849592146952559,
            max_amount: "10000",
            min_amount: "1",
            name: "USDT",
            network_icon: "https://ethereum.org/favicon-32x32.png?v=8b512faa8d4a0b019c123a771b6622aa",
            network_id: 4248807671857512,
            network_name: "PSC",
            per_address_amount: "",
            symbol: "USDT",
            updated_at: "2021-09-06T16:30:28.629+08:00",
        }
        ],
        // 选中的网络1
        actionNetworkOne: {},
        // 选中的网络2
        actionNetworkTwo: {},
        // 输入数量 
        amount: '',
        // 输入接收的地址 
        inpAddress: '',
        // 输入的发起地址
        inpFromAddress: '',
        // 订单单号
        orderId: '',
        // 订单详情
        orderDetails: {
            // 用户计划交易金额
            amount: "string",
            // 资产全名
            assetName: "string",
            // 转换起始方的网络名称
            assetNetworkFromName: "string",
            // 转换起始方的事务查询地址
            assetNetworkFromTxUrl: "string",
            // 转换目标方的网络名称
            assetNetworkToName: "string",
            // 转换目标方的事务查询地址
            assetNetworkToTxUrl: "string",
            // 资产标识
            assetSymbol: "string",
            // 创建时间
            created_at: "string",
            // 铸造重试记录
            forgeRetryList: [
                {
                    // 创建时间
                    created_at: "string",
                    // 失败原因
                    reason: "string",
                    // 状态 0.失败 1.成功
                    status: 0
                }
            ],
            id: 0,
            // 转币超时时间
            outed_at: "string",
            // 退还重试记录
            refundRetryList: [
                {
                    // 创建时间
                    created_at: "string",
                    // 失败原因
                    reason: "string",
                    // 状态 0.失败 1.成功
                    status: 0
                }
            ],
            // 0.发起交易，待转币 1.转币超时 2.转币成功，等待铸造 3.铸造失败，等待重试 4.交易失败，等待退回资金 5.退还资金成功 6.退还资金失败，等待重试 7.退还资金失败，等待手动结束 8.已手动结束 200.铸造成功，已放币
            status: 3,
            // 转换方向 1入 2出
            swapDirection: 0,
            // 更新时间
            updated_at: "string"
        },
        // 二维码页面是否显示
        qrCodeIfshow: false,
        qrCodeVal:'',
        // 询问订单地址
        // wdcPath:'http://43.155.81.246:8080/chain/public',
        wdcPath:'https://bridge.polysmartchain.com/wdc/chain/public',
        // wdcPath:'http://bridge.polysmartchain.com/wdc/chain/public',
        // 图片前缀
        imgPath:'https://8.218.10.38:19600/public/images/',
        // 下订单时的订单参数
        orderReq:{},

        // 锁定页面判定wdc的name（就是wdc链叫什么）
        wdcName:'WDC'

    },
    // 设置订单req
    setOrderReq(val) {
        this.state.orderReq = val
    },
    // 更新订单id和哈希
    setOrderReqHash(val) {
        // console.log(this.state.orderId);
        // console.log(parseInt(this.state.orderId));
        // console.log(this.state.orderId/1);
        // console.log(Number(this.state.orderId));
        this.state.orderReq.id = this.state.orderId
        this.state.orderReq.transferInTxhash = val
    },
    // 设置钱包地址
    setWalletAddress(val) {
        this.state.walletAddress = val
        // console.log('set', this.state.walletAddress)
    },
    // 设置钱包网络
    setWalletNetworkId(val) {
        this.state.walletNetworkId = val
        // console.log('set', this.state.walletNetworkId)
    },
    // 设置钱包网络名称 
    setWalletNetworkName(val) {
        this.state.walletNetworkName = val
        // console.log('set', this.state.walletNetworkName)
    },
    // 设置资产列表
    setAssetsList(val) {
        this.state.assetsList = val
        // console.log('set', this.state.assetsList)
    },
    // 设置选中的资产
    setActionAssets(val) {
        this.state.actionAssets = val
        // console.log('set', this.state.actionAssets)
    },
    // 设置网络列表
    setNetworkList(val) {
        this.state.networkList = val
        // console.log('set', this.state.networkList)
    },
    // 设置选中的网络1
    setActionNetworkOne(val) {
        this.state.actionNetworkOne = val
        // console.log('set', this.state.actionNetworkOne)
    },
    // 设置选中的网络2
    setActionNetworkTwo(val) {
        this.state.actionNetworkTwo = val
        // console.log('set', this.state.actionNetworkTwo)
    },
    // 设置输入数量
    setAmount(val) {
        this.state.amount = val
        // console.log('set', this.state.amount)
    },
    // 设置订单id
    setOrderId(val) {
        this.state.orderId = val
        // console.log('set', this.state.orderId)
    },
    // 设置订单详情
    setOrderDetails(val) {
        this.state.orderDetails = val
        // console.log('set', this.state.orderDetails)
    },
    // 设置二维码状态
    setQrCodeIfshow(val) {
        this.state.qrCodeIfshow = val
    },
    // 设置二维码内容
    setRrCodeVal(val) {
        this.state.qrCodeVal = val
    },
    
}
export default Store