import PropTypes from "prop-types";
import { Alert } from "antd";

const ErrorAlert = ({ message }) => {
    return <Alert message="Ошибка загрузки" description={message || "Произошла ошибка"} type="error" showIcon />;
};

ErrorAlert.propTypes = {
    message: PropTypes.string,
};

export default ErrorAlert;
