#include <iostream>
#include <vector>
#include <onnxruntime_cxx_api.h>

int main() {

    Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "MinimalInference");
    Ort::SessionOptions session_options;


    session_options.DisableMemPattern();
    session_options.SetIntraOpNumThreads(1);
    session_options.SetGraphOptimizationLevel(GraphOptimizationLevel::ORT_ENABLE_ALL);

    const char* model_path = "model/model.onnx";
    Ort::Session session(env, model_path, session_options);

    // 3. Define raw, contiguous memory buffers for input/output
    std::vector<float> input_tensor_values = {1.0f, 2.0f, 3.0f, 4.0f}; // Replace with your data
    std::vector<int64_t> input_node_dims = {1, 4}; // Example shape [Batch, Features]

    // 4. Wrap raw memory without copying it
    auto memory_info = Ort::MemoryInfo::CreateCpu(OrtArenaAllocator, OrtMemTypeDefault);
    Ort::Value input_tensor = Ort::Value::CreateTensor<float>(
        memory_info, input_tensor_values.data(), input_tensor_values.size(),
        input_node_dims.data(), input_node_dims.size()
    );

    // 5. Hardcode layer names to save overhead of querying strings at runtime
    const char* input_names[] = {"input_layer_name"};
    const char* output_names[] = {"output_layer_name"};

    // 6. Execute inference synchronously
    auto output_tensors = session.Run(
        Ort::RunOptions{nullptr},
        input_names, &input_tensor, 1,
        output_names, 1
    );

    // 7. Access raw output data buffer directly
    float* float_arr = output_tensors[0].GetTensorMutableData<float>();
    std::cout << "First output element: " << float_arr[0] << std::endl;

    return 0;
}