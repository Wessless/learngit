import Mock from 'mockjs';

Mock.mock('http://localhost:3001/getFilesByID', {
    'data|1-10':[{
        'date': '2016-05-02 12:11:02',
    }]
    // ,{
    //     date: '2016-05-02 12:11:02',
    //     name: '王小虎',
    //     size: '10KB',
    //     type: 'file',
    //     selected:false,
    // },{
    //     date: '2016-05-02 12:11:02',
    //     name: '王小虎',
    //     size: '10KB',
    //     type: 'file',
    //     selected:false,
    // },{
    //     date: '2016-05-02 12:11:02',
    //     name: '王小虎',
    //     size: '10KB',
    //     type: 'file',
    //     selected:false,
    // }]
});
