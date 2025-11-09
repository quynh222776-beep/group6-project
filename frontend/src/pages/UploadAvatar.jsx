import React, { useState } from 'react';
import axios from 'axios';

const UploadAvatar = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Kiểm tra loại file
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setMessage('Vui lòng chọn một file ảnh.');
      return;
    }

    // Kiểm tra kích thước file (5MB)
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setMessage('File quá lớn. Vui lòng chọn file dưới 5MB.');
      return;
    }

    setFile(selectedFile);

    // Tạo preview cho ảnh đã chọn
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Vui lòng chọn ảnh trước khi tải lên.');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Avatar đã được cập nhật thành công!');
    } catch (error) {
      setMessage('Lỗi khi cập nhật avatar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Upload Avatar</h2>
      
      {/* Hiển thị hình ảnh đã chọn */}
      {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? '⏳ Đang tải lên...' : 'Cập nhật avatar'}
      </button>
      
      {/* Hiển thị thông báo */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadAvatar;
