import EditCustomerForm from '@/components/layout/EditCustomerForm';
import SideBar from '@/components/layout/SideBar';

export default function ManageShop() {
  return (
    <>
    
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
        <SideBar navigation='pelanggan'></SideBar>
        <EditCustomerForm></EditCustomerForm>
    </div>
    </>
  );
}
