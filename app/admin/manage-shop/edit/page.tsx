import EditShopForm from '@/components/layout/EditShopForm';
import SideBar from '@/components/layout/SideBar';

export default function ManageShop() {
  return (
    <>
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
        <SideBar navigation='toko'></SideBar>
        <EditShopForm></EditShopForm>
    </div>
    </>
  );
}
