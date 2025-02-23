import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingIndicator = () => (
    <div className="loading-indicator" style={{ display: "flex", justifyContent: "center" }}>
        <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
);

export default LoadingIndicator;
