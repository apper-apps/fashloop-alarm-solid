import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import Button from './Button';
import ApperIcon from '../ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="w-full justify-start text-gray-400 hover:text-white hover:bg-error/10 hover:border-error/30"
    >
      <ApperIcon name="LogOut" size={16} className="mr-3" />
      Logout
    </Button>
  );
};

export default LogoutButton;