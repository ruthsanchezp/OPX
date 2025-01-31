export const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    
    if (today.getMonth() < birth.getMonth() || 
       (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  