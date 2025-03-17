import uvicorn
if __name__ == "__main__":
    uvicorn.run("email_management_system.main:app", host="0.0.0.0", port=4000, reload=True) 