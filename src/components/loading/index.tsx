import React from 'react';
import './index.less';

const Loading = React.memo(() => {
    return <div className='loading'>
        <img alt='loading' className='loading-img' src={require('@/asserts/images/loading.gif')} />
    </div>
});

export default Loading;