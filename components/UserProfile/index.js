import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import jwtDecoded from 'jwt-decode';
import Image from '../Image';
import Button from '../Button';
import { getDetailWorker } from '../../redux/actions/worker';
import { NODE_ENV, API_DEV, API_PROD } from '../../helpers/env';

export default function UserProfile() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const token = Cookies.get('token');
  const dispatch = useDispatch();
  const worker = useSelector((state) => state.worker);

  let decoded = '';
  if (token) {
    decoded = jwtDecoded(token);
  }

  useEffect(() => {
    if (decoded) {
      dispatch(getDetailWorker(decoded.user_id));
    }
  }, []);

  const logout = () => {
    Cookies.remove('token');
    router.push('/worker/login');
  };

  return (
    <li className="drop__nav" onClick={() => setIsOpen(!isOpen)}>
      <Image
        className="user__profile mb-0"
        srcImage={`${
          NODE_ENV === 'development'
            ? `${API_DEV}uploads/users/${worker.data?.photo}`
            : `${API_PROD}uploads/users/${worker.data?.photo}`
        }`}
        altImage={worker.data?.name}
        imageClass="img-cover rounded-circle"
        imageWidth={40}
        imageHeight={40}
        onError={() => setSrc(`${API_PROD}uploads/users/profile-default.png`)}
      />
      <ul className={`${isOpen ? 'dropdown clicked' : 'dropdown m-0 p-0'}`}>
        <li className="nav-item">
          <Button className="btn nav-link">Profile</Button>
        </li>
        <li className="nav-item">
          <Button className="btn nav-link" onClick={logout}>
            Logout
          </Button>
        </li>
      </ul>
      <Image
        srcImage="/icons/icon-polygon.svg"
        className={`${
          isOpen ? 'arrow clicked ms-2' : 'arrow not-clicked ms-2'
        }`}
        imageWidth={20}
        imageHeight={20}
      />
    </li>
  );
}
