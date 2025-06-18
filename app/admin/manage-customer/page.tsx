import ManageCustomerContent from '@/components/layout/ManageCustomerContent';
import NoContent from '@/components/layout/NoContent';
import SideBar from '@/components/layout/SideBar';

export default function ManageCustomer() {
  return (
    <>
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
        <SideBar navigation='pelanggan'></SideBar>
        <ManageCustomerContent></ManageCustomerContent>
    </div>
    </>
  );
}
