import { useRouter } from "next/navigation";

function SidePanel() {
  const router = useRouter();
  return (
    <div className="text-white p-10 bg-gradient-to-br from-[#007946] to-[#63A68E]">
      <div className="">
        <h1 className="text-6xl font-bold">EasyPark</h1>
        <p className="text-sm mt-2">Find your nearby parking space</p>
      </div>

      <hr className="my-10" />

      <div className="flex flex-col items-start space-y-8 font-semibold text-xl">
        <button className="settingBtn" onClick={() => router.push("/")}>
          Add new parking
        </button>
        <button className="settingBtn" onClick={() => router.push("/showall")}>
          Show all parkings
        </button>
        {/* <button
          className="settingBtn"
          onClick={() => router.push("/qrscanner")}
        >
          Scan QR code
        </button> */}
      </div>
    </div>
  );
}

export default SidePanel;
