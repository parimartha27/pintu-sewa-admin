import DashboardContent from '@/components/layout/DashboardContent';
import SideBar from '@/components/layout/SideBar';

export default function Dashboard() {
  return (
    <>
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-800">
        <SideBar navigation='dashboard'></SideBar>
        <DashboardContent></DashboardContent>
    </div>
    </>
  );
}