

import Seek from '../pages/seek';
import SeekSearch from '../pages/seek/JobSearch';
import Linkdin from '../pages/Linkdin';

const routers = [
  {
    path: '/',
    name: 'Home',
    // element: () => import('@/views/Home.vue'),
  },
  {
    path: '/seek',
    name: 'Seek',
    element: <Seek />,
    children: [
      {
        path: 'jobs',
        name: 'Seek jobs',
        element: <h1>Seek jobs</h1>,
      },
      {
        path: 'search',
        name: 'Seek jobs',
        element: <SeekSearch></SeekSearch>,
      },
    ],
  },
  {
    path: '/linkdin',
    name: 'Linkdin',
    element: <Linkdin />,
  },
];

export default routers;