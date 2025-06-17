import ManageReportContent from '@/components/layout/ManageReportContent';
import SideBar from '@/components/layout/SideBar';
import NoContent from '@/components/layout/NoContent';

export default function ManageCustomer() {
  return (
    <>
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
        <SideBar navigation='keluhan'></SideBar>
        <ManageReportContent />
    </div>
    </>
  );
}
